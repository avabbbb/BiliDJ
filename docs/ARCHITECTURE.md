# Architecture — BiliDJ 2.0

_Last updated: 2026-10-01_

## Goals

The architecture must support:

- low-friction Hot Cue on one video,
- the same cue engine across multiple sites,
- two independently controlled browser tabs,
- millisecond-level user nudging,
- later drift correction,
- Manifest V3 lifecycle constraints,
- narrow permissions and local-first storage.

It must not depend on private media URLs or an embedded second-site iframe.

## Runtime map

```text
┌──────────────────────────── Browser ────────────────────────────┐
│                                                                 │
│  Tab A                          Tab B                            │
│  ┌─────────────────────┐       ┌─────────────────────┐          │
│  │ Site page           │       │ Site page           │          │
│  │ <video>/<audio>     │       │ <video>/<audio>     │          │
│  │ Content Script      │       │ Content Script      │          │
│  │  - adapter          │       │  - adapter          │          │
│  │  - media controller│       │  - media controller│          │
│  │  - cue overlay     │       │  - cue overlay     │          │
│  └─────────┬───────────┘       └─────────┬───────────┘          │
│            │ chrome.tabs messaging        │                      │
│            └──────────────┬────────────────┘                      │
│                           ▼                                       │
│                ┌─────────────────────┐                            │
│                │ Extension Side Panel│                            │
│                │  - deck registry    │                            │
│                │  - session state    │                            │
│                │  - manual sync UI   │                            │
│                │  - sync engine      │                            │
│                └──────────┬──────────┘                            │
│                           │                                       │
│             ┌─────────────┴─────────────┐                         │
│             ▼                           ▼                         │
│  chrome.storage.local       chrome.storage.session / memory       │
│  cue persistence            tab bindings / runtime session        │
│                                                                 │
│  Service Worker: install/update/action + lightweight routing      │
└─────────────────────────────────────────────────────────────────┘
```

## Why the realtime engine lives in the Side Panel

Manifest V3 extension service workers are event-driven and may be terminated after idle periods. Chrome documents a normal 30-second inactivity shutdown condition.

A continuously evaluated sync loop therefore should not rely on service-worker globals.

The Side Panel is a better session owner because:
- it is an extension page,
- it can remain open across tab navigation,
- it can communicate with tab content scripts,
- it maps naturally to the user-visible Deck A / Deck B controller.

The service worker should be restart-safe and reconstructable.

Reference:
- https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
- https://developer.chrome.com/docs/extensions/develop/ui/create-a-side-panel

## Layer 1 — Media controller

The media controller is platform-neutral.

Target contract:

```ts
type MediaSnapshot = {
  currentTime: number
  duration: number | null
  paused: boolean
  playbackRate: number
  readyState: number
  timestamp: number
}

interface MediaController {
  snapshot(): MediaSnapshot
  play(): Promise<void>
  pause(): void
  seek(seconds: number): void
  setPlaybackRate(rate: number): void
}
```

It wraps the media element selected by the adapter.

Use standard platform APIs:
- `HTMLMediaElement.currentTime`,
- `play()`,
- `pause()`,
- `playbackRate`,
- `seeking / seeked / timeupdate / ratechange / play / pause`,
- `requestVideoFrameCallback()` where supported for finer video-frame timing.

`requestVideoFrameCallback()` is an enhancement, not a hard requirement.

Reference:
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

## Layer 2 — Platform adapters

Target adapters:

```text
generic-html5
bilibili
douyin
tiktok
```

Responsibilities:
- decide whether the adapter applies,
- find/rank media elements,
- derive a stable media identity,
- derive display title/canonical URL,
- detect SPA navigation/player replacement,
- expose platform health/debug metadata.

Non-responsibilities:
- Hot Cue semantics,
- storage schema,
- keyboard mappings,
- deck sync,
- UI business rules.

### Media candidate ranking

Short-video pages may keep several `<video>` nodes alive.

Use a score instead of “largest element wins” only.

Candidate signals:
- currently playing,
- visible / intersection ratio,
- rendered pixel area,
- readyState,
- proximity to the active feed item,
- not `display:none` / detached.

Example:

```text
score =
  playing ? +1000 : 0
  + visibleRatio * 500
  + normalizedArea * 200
  + readyState * 20
```

Each adapter may add site-specific signals, but the generic resolver owns the common scoring behavior.

## Layer 3 — Cue engine

Cue state is keyed by stable media identity.

```ts
type Cue = {
  slot: number        // 1..8 initially
  time: number
  label?: string
  createdAt: number
  updatedAt: number
}

type MediaIdentity = {
  platform: string
  mediaId: string
  canonicalUrl?: string
}

type MediaCueSet = {
  schemaVersion: 2
  identity: MediaIdentity
  title?: string
  cues: Cue[]
}
```

Storage key example:

```text
bilidj.cues.v2:bilibili:BVxxxxxxxxxx
```

Do not use tab IDs as persistent media identity.

### Cue timing

When setting a cue:
1. take the current media time,
2. validate finite non-negative value,
3. optionally pair it with the current frame timestamp metadata,
4. persist.

When triggering:
1. seek,
2. wait for `seeked` or a short fallback deadline,
3. preserve the current play/pause intent unless the interaction mode explicitly says “play from cue.”

The first implementation should favor predictable behavior over clever quantization.

## Layer 4 — Deck session

A deck binding is ephemeral:

```ts
type DeckBinding = {
  deck: 'A' | 'B'
  tabId: number
  platform: string
  mediaId: string
  title: string
  connected: boolean
}

type SyncAnchor = {
  mediaTime: number
  capturedAt: number
}
```

The side panel maintains:
- Deck A binding,
- Deck B binding,
- anchor A,
- anchor B,
- manual offset,
- current master,
- sync lock enabled/disabled,
- last error/drift measurement.

If a tab navigates to another media item, the binding becomes “changed” and requires explicit confirmation or automatic identity refresh with a clear UI state.

## Manual sync first

For v1 Dual Deck:

```text
expectedB = anchorB
          + (currentA - anchorA)
          + userOffset
```

The user controls `userOffset` directly.

Recommended buttons:
- −100 ms,
- −10 ms,
- +10 ms,
- +100 ms.

The exact signs must be described in human terms in UI, e.g. “B earlier” / “B later”, because “+ offset” is easy to interpret backwards.

## Sync Lock later

Do not ship automatic correction before manual sync is measurable.

A starting control strategy, to be tuned through dogfood:

```text
error = actualB - expectedB

|error| < 30 ms
  -> no correction

30 ms <= |error| < 150 ms
  -> short soft correction with playbackRate around 0.985–1.015

|error| >= 150 ms
  -> hard seek, then settle
```

These are implementation starting points, not accuracy promises.

Important:
- rate correction must be bounded,
- restore nominal playbackRate after correction,
- avoid oscillation with hysteresis,
- suspend correction while either deck is seeking/buffering,
- record measured error so thresholds can be tuned.

## Messaging

For side-panel → tab commands:

```ts
chrome.tabs.sendMessage(tabId, {
  type: 'BILIDJ_MEDIA_COMMAND',
  command: 'seek',
  payload: { time }
})
```

For tab → extension health/snapshot messages, use runtime messaging or a connection while the session is active.

Every message must include:
- protocol version,
- tab/media identity where relevant,
- request ID for commands needing acknowledgement.

Do not assume a message means the media action completed. Seek commands need acknowledgement after `seeked` or failure.

## Planned source layout

```text
src/
  background/
    service-worker.ts

  content/
    bootstrap.ts
    overlay/
    messaging/

  core/
    cue/
    media/
    sync/
    protocol/
    storage/

  platforms/
    generic/
    bilibili/
    douyin/
    tiktok/

  sidepanel/
    app/
    components/
    state/

  shared/
    types/
    constants/

tests/
  unit/
  fixtures/
  manual/
```

The codebase does not need to migrate to TypeScript in one giant commit. The directory and module boundaries matter more than the language change.

## Permissions

Target minimal capability set should be reviewed per milestone.

Hot Cue across three named sites can use explicit host access for those sites plus `storage`.

Dual Deck may need tab querying/identity information. Avoid requesting broader access than required.

Audio capture is **not** needed for Cue or basic Dual Deck control.

If future mixing/recording requires `chrome.tabCapture`, it must be a separate milestone because:
- it is a new permission,
- capture requires explicit user invocation,
- capturing a tab changes audio-routing behavior.

Reference:
- https://developer.chrome.com/docs/extensions/reference/api/tabCapture
- https://developer.chrome.com/docs/webstore/program-policies/permissions

## Failure model

The UI must distinguish:

- **No media** — no controllable media element found.
- **Ambiguous media** — multiple candidates, adapter uncertain.
- **Detached** — player replaced during SPA navigation.
- **Autoplay blocked** — `play()` rejected until user gesture.
- **Seek pending** — command sent, not yet completed.
- **Buffering** — media not currently able to follow sync.
- **Deck changed** — assigned tab navigated to a different video.
- **Disconnected** — assigned tab closed or content script unavailable.

These are product states, not console-only errors.

## Security and privacy

BiliDJ should remain local-first.

Do not:
- transmit URLs/history to a backend by default,
- inject remote executable JavaScript,
- request credentials/cookies,
- store authentication tokens,
- log full browsing activity.

Chrome Web Store policy requires a narrow, understandable single purpose and the minimum necessary permissions.

Reference:
- https://developer.chrome.com/docs/webstore/program-policies/policies
