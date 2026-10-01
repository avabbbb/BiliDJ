# AGENTS.md

This file is the authoritative operating context for coding agents working in BiliDJ.

## 1. North star

**BiliDJ turns an online video that the user is already watching into a playable performance surface.**

The product is not a downloader and not a browser-based DAW.

The two product primitives are:

1. **Hot Cue** — instant, persistent jumps to user-marked moments.
2. **Dual Deck** — pair two supported tabs, manually align their anchors, then optionally reduce playback drift.

Everything else must justify itself as an extension of those primitives.

## 2. Current phase

The repository contains a legacy v0.1 Bilibili-only prototype.

The implementation roadmap in `docs/ROADMAP.md` is authoritative for new work. Do not treat the legacy full-screen Theater UI or iframe-based right deck as the desired architecture.

When a task conflicts with the old code and the 2.0 docs, prefer the 2.0 docs unless the user explicitly says otherwise.

## 3. Architecture invariants

These are hard constraints unless a dedicated ADR changes them.

### Host page integrity

- Do **not** physically move / re-parent the site’s `<video>` element into extension UI.
- Do not replace the native player with an iframe or cloned media element.
- Prefer a minimal overlay and direct control of the media element already playing on the page.
- Platform-specific DOM selectors belong in adapters, never in core timing logic.

### Media boundary

- Core functionality must operate on `HTMLMediaElement` APIs: `currentTime`, `play()`, `pause()`, `playbackRate`, events, and where useful `requestVideoFrameCallback()`.
- Do not scrape or reconstruct private CDN / DASH / m4s URLs just to implement Hot Cue or Dual Deck.
- Do not bypass login, paywall, DRM, anti-hotlinking, or site access controls.

### Execution contexts

- **Content script:** owns the local page media handle, platform adapter, media snapshot, seek / play / pause / rate operations, and the smallest possible in-page UI.
- **Side panel / extension page:** owns Deck A/B assignment, manual sync UI, long-lived session state, and realtime sync decisions while the panel is open.
- **Service worker:** owns install/update lifecycle, action behavior, registration and lightweight routing. It must be stateless enough to survive termination.
- **Storage:** `chrome.storage.local` for persistent cue/session preferences; `chrome.storage.session` or in-memory side-panel state for ephemeral runtime bindings.

Do not make the MV3 service worker the realtime clock.

### Platform abstraction

Core code must talk to a platform-neutral adapter contract. A target shape is:

```ts
interface PlatformAdapter {
  id: 'generic' | 'bilibili' | 'douyin' | 'tiktok'
  matches(url: URL): boolean
  findMedia(): HTMLMediaElement | null
  getMediaIdentity(media: HTMLMediaElement): MediaIdentity
  getTitle(media: HTMLMediaElement): string
  observeNavigation(onChange: () => void): () => void
}
```

A platform adapter may locate the correct media element and derive identity/title. It must not own Cue semantics, Dual Deck semantics, or the sync algorithm.

### Permissions

- Never use `<all_urls>` unless a documented product requirement proves it necessary.
- Request only explicit supported domains or optional host access.
- Do not add `tabCapture`, microphone, downloads, clipboard, history, or broad tab permissions until a shipped feature needs them.
- Every new permission requires a doc update and a privacy review in the same PR.

## 4. Product behavior

### Hot Cue

Default interaction target:

- `Digit1`–`Digit8` on an empty slot: set cue at current media time.
- `Digit1`–`Digit8` on a populated slot: jump to that cue.
- `Shift + Digit1`–`Digit8`: clear the cue.
- Timeline/pad click: trigger cue.
- Dragging a marker may reposition a cue in a later iteration.

Use `KeyboardEvent.code` for digit shortcuts so Shift does not turn `1` into `!`.

Never trigger performance keys when focus is inside an input, textarea, select, or contenteditable element.

The extension must expose an obvious “Performance keys armed” state. Avoid silently stealing common page shortcuts.

### Dual Deck

- The user explicitly assigns tabs to Deck A and Deck B.
- Deck A is the default master in the first implementation.
- Manual sync precedes automatic sync.
- Nudge controls should include at least ±10 ms and ±100 ms.
- Sync correction thresholds are tunable defaults, not product promises.
- If a platform/tab cannot be controlled, show a degraded state instead of pretending sync succeeded.

## 5. UI rules

- Do not recreate the legacy full-screen dark Theater UI.
- The website remains the primary surface.
- Hot Cue should require minimal chrome: compact pads/markers + concise feedback.
- Dual Deck belongs in the extension Side Panel.
- Optimize for glanceability and muscle memory, not “DJ-looking” decoration.
- No fake turntables, fake waveforms, or decorative controls that do not correspond to real state.
- Motion must communicate state and respect `prefers-reduced-motion`.
- Keyboard focus and screen-reader labels are required for all interactive controls.

## 6. Data model rules

Persist cues by stable media identity, not only by page URL.

Target shape:

```ts
type Cue = {
  slot: number
  time: number
  label?: string
  createdAt: number
  updatedAt: number
}

type MediaCueSet = {
  schemaVersion: number
  platform: string
  mediaId: string
  canonicalUrl?: string
  title?: string
  cues: Cue[]
}
```

Every persisted schema needs an explicit version and migration path.

Do not persist a DOM node, tab ID, or transient player object.

## 7. PR discipline

Prefer small, reviewable PRs with one architectural purpose.

A PR should normally contain:

- a concise problem statement,
- implementation notes,
- manual test steps,
- known limitations,
- screenshots/GIF only when UI behavior changed,
- docs updated when behavior/architecture changed.

Do not bundle “while I am here” redesigns into a functional fix.

Generated `dist/`, ZIP files, browser profiles and local test media must not be committed.

## 8. Test expectations

At minimum, every functional change must consider:

- Bilibili normal video page,
- SPA navigation to another Bilibili video without extension reload,
- typing in search/comment fields while performance keys are armed,
- no media / multiple media elements,
- paused and playing seek behavior,
- reload persistence for cues,
- missing/changed platform selectors,
- tab closed or navigated after being assigned to a deck.

Cross-platform work adds Douyin and TikTok cases as adapters land.

Sync work must record measured error in milliseconds and distinguish:
- command dispatch latency,
- seek completion latency,
- steady-state drift.

## 9. Documentation ownership

- `docs/PRODUCT.md`: product scope and user value.
- `docs/ARCHITECTURE.md`: technical boundaries.
- `docs/INTERACTION.md`: UI and input behavior.
- `docs/ROADMAP.md`: implementation sequence.
- `docs/RESEARCH.md`: external evidence and competitor notes.
- `docs/GO_TO_MARKET.md`: distribution / commercial hypotheses.
- `docs/HISTORY.md`: historical context only.

Historical documents must never override current docs.
