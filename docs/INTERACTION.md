# Interaction specification — BiliDJ 2.0

_Last updated: 2026-10-01_

## Design objective

BiliDJ should feel closer to performance pads than to a settings dashboard.

The user should be able to discover a useful moment, mark it, and trigger it again without leaving the video or understanding DJ terminology.

The old “take over the entire page and turn it into a fake mixer” interaction is retired.

## Surface model

BiliDJ uses three surfaces with different responsibilities.

### 1. Browser action

Purpose:
- open/close the side panel,
- show whether the current tab is supported,
- entry point for first-run explanation.

It should not become a full popup app.

### 2. In-page performance overlay

Purpose:
- show Hot Cue slots/markers,
- show “performance keys armed” state,
- provide very short feedback such as “Cue 3 set · 01:12.48”.

It must not reflow or replace the native player.

### 3. Side Panel

Purpose:
- Deck A / Deck B assignment,
- anchor controls,
- manual sync/nudge,
- session diagnostics,
- advanced settings.

It can remain open while the user switches tabs.

## Hot Cue

### Default behavior

Slots: 1–8.

| Input | Empty slot | Populated slot |
| --- | --- | --- |
| `1` … `8` | Set cue at current time | Jump to cue |
| `Shift+1` … `Shift+8` | No-op / short hint | Clear cue |
| Click pad | Set cue | Jump to cue |
| Shift + click pad | No-op | Clear cue |

Use `KeyboardEvent.code` (`Digit1` etc.) rather than the printable character so Shift handling is layout-safe.

### Key safety

Performance keys are captured only when:
- a supported media element is connected,
- BiliDJ is armed for the current tab,
- focus is not in text input / textarea / select / contenteditable.

Arming must be visible.

When unarmed, BiliDJ should not steal page number shortcuts.

### Feedback

Set:
```text
[3] SET   01:12.48
```

Trigger:
```text
[3] CUE   01:12.48
```

Clear:
```text
[3] CLEARED
```

Failure:
```text
Cue 3 could not seek — player changed
```

Feedback should disappear quickly but remain accessible through ARIA live status.

## Cue visualization

Do not try to permanently rewrite each platform’s native progress bar in the first implementation; those DOMs are brittle.

Preferred v1:
- a tiny horizontal BiliDJ cue rail over/under the player,
- 8 compact numbered pads,
- marker positions proportional to media duration,
- optional collapse button.

Later adapters may integrate markers into a native progress bar when the integration proves stable.

## Side Panel — Hot Cue section

When the current tab is supported:

```text
BiliDJ
Current: Bilibili · “video title”
● Connected

Performance keys        [ ARMED ]

CUES
[1] 00:12.43   [2] 00:18.09   [3] —
[4] —          [5] —          [6] —
[7] —          [8] —

[Clear all cues]
```

Advanced labels should be secondary. The core should remain playable without editing names.

## Dual Deck flow

### Step 1 — assign A

User is on a beat/video tab.

Side Panel:
```text
DECK A
[Use current tab]
```

After assignment:
```text
A · Bilibili
Boom Bap Beat
● Connected
00:42.317
```

### Step 2 — assign B

User switches to the speech/reaction video.

Side Panel stays open.

```text
DECK B
[Use current tab]
```

### Step 3 — set anchors

Each deck has:
- `Set anchor`,
- anchor time,
- `Preview from anchor`.

Example:

```text
A anchor   00:12.000
B anchor   00:03.482
```

### Step 4 — play together

```text
[▶ PLAY BOTH]
```

If browser autoplay rules block one deck, show which deck failed and ask for a click in that tab. Do not silently continue with one deck.

### Step 5 — nudge

Use language describing the audible result.

```text
B TIMING

[Earlier 100ms] [Earlier 10ms]
        offset: -40 ms
[Later 10ms]   [Later 100ms]
```

This is preferable to unlabeled plus/minus buttons.

The user’s mental model is “move the voice earlier/later,” not “change a mathematical offset.”

### Step 6 — replay

```text
[↺ REPLAY FROM ANCHORS]
```

This must seek both decks to anchors + offset and start again.

## Sync Lock

Sync Lock is disabled by default until the manual path works well.

Future UI:

```text
SYNC LOCK        [ OFF ]

Master           A
Drift            +24 ms
Correction       idle
```

When enabled:
- status must expose current drift,
- buffering/seek suspends correction,
- user can disable instantly,
- manual offset remains the target reference and is never silently overwritten.

## Visual direction

### Keep

- compact,
- dark/light adaptive where practical,
- high contrast,
- numeric monospaced timing,
- subtle state animation,
- strong connected/error indicators.

### Avoid

- fake vinyl decks,
- giant waveform art without analyzed audio,
- full-page modal takeover,
- “Notion clone” cards,
- overexplained three-step onboarding on every launch,
- decorative controls that imply unavailable functionality.

The product can feel musical without pretending to be hardware.

## Responsive behavior

Side Panel is the canonical controller and should work around 320–500 px width.

The in-page overlay should:
- never cover primary player controls if avoidable,
- collapse to an 8-pad strip,
- survive fullscreen transitions or hide intentionally with clear behavior.

## Accessibility

Required:
- all buttons keyboard reachable,
- visible focus state,
- `aria-pressed` for armed/toggle states,
- `aria-live` for cue feedback,
- no meaning conveyed by color alone,
- reduced-motion support.

## First-run education

One compact explanation is enough:

```text
Turn this video into a deck.

1–8: set or trigger a cue
Shift + 1–8: clear a cue

[Arm performance keys]
```

After the user has created a cue once, the explanation should collapse and stay out of the way.
