# Research — competitors, interaction patterns and implementation evidence

_Research refreshed: 2026-10-01_

This document records external evidence used for BiliDJ 2.0. It is not a feature checklist to copy blindly.

## 1. YouTube Sampling

Chrome Web Store:
https://chromewebstore.google.com/detail/youtube-sampling/oankfjpgnkaadhiacnljlflelobhjgef

Observed positioning as of 2026-09-14:
- “Sample YouTube videos like a DJ.”
- First press on a number marks a moment; pressing again jumps back.
- Cue markers are shown on the timeline.
- Cue state is saved per video.
- Free tier exposes 3 cues.
- Pro advertises 9 cues, loops, per-cue speed and labels.
- Listed pricing: USD $2.99/month or $14.99/year.
- Store description states cue data stays in the browser and no tracking is used.

### Lesson for BiliDJ

The smallest viable product is cueing, not a mixer.

It also shows that users can understand “number key = saved moment” without a large DJ metaphor.

BiliDJ differentiation should therefore come from:
- Bilibili/Douyin/TikTok support,
- cross-tab Dual Deck,
- manual speech/beat alignment,
- later sync assistance.

Do not compete by adding more panels before these differentiators work.

## 2. YouTube Beatmaker Cues v2

Repository:
https://github.com/jrucho/YTbeatmakercues-v2

The project demonstrates how far browser media performance can be pushed:
- up to 10 keyboard cue points,
- loops,
- playback/pitch controls,
- Web Audio processing,
- AudioWorklet modules,
- MIDI,
- sequencer,
- cross-tab/VJ features,
- minimal and advanced UI modes.

Its README explicitly describes a performance-oriented workflow influenced by OP-Z, Ableton Live and SP-404.

### Architectural lesson

The browser is capable enough for much more than basic seek.

However, BiliDJ should avoid inheriting a monolithic “everything in one content script” shape. Our goal is a smaller core plus explicit platform adapters and a separate Side Panel session controller.

### Product lesson

A **minimal performance surface + optional advanced panel** is a better progressive-disclosure model than always opening a giant mixer.

## 3. Serato Hot Cue interaction

Serato controller documentation consistently uses this pattern:
- in Hot Cue mode, a pad sets/plays a cue,
- Shift + populated pad deletes the cue.

Example:
https://support.serato.com/hc/en-us/articles/17616872214799-Hercules-DJControl-T10-Quickstart-Guide-for-Serato-DJ-Pro

### Lesson for BiliDJ

Use a single-slot mental model:
- empty slot → set,
- populated slot → trigger,
- Shift → clear.

This is simpler than the old BiliDJ form where the user chose a key, track, time and label manually.

## 4. Mixxx

Manual:
https://manual.mixxx.org/

Mixxx exposes:
- hot cues,
- cue/play behavior,
- tempo sync,
- small temporary tempo adjustments,
- keyboard/MIDI mappings,
- sampler hot cues.

Older/manual references also describe using hot cues on drum sounds as a mini drumkit.

### Lesson for BiliDJ

The important interaction primitives are:
- trigger,
- nudge,
- sync,
- loop,
- optional MIDI.

The order matters. BiliDJ should implement them in that sequence rather than starting with EQ/crossfader aesthetics.

## 5. Chrome Side Panel

Official documentation:
https://developer.chrome.com/docs/extensions/develop/ui/create-a-side-panel

Chrome Side Panel can remain available while navigating between tabs.

### Lesson for BiliDJ

This directly matches the Dual Deck workflow:
- assign Tab A,
- switch to Tab B,
- keep the controller visible.

It is a better home for cross-tab session state than a page takeover or transient popup.

## 6. Manifest V3 service worker lifecycle

Official documentation:
https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle

Chrome documents normal service-worker termination after periods such as 30 seconds of inactivity.

### Lesson for BiliDJ

Do not make the background service worker the realtime sync clock.

Use it for lifecycle/routing; keep active session logic in a visible extension page such as the Side Panel.

## 7. Video frame callback

MDN:
https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

The API supplies callbacks when a new video frame is sent to the compositor and explicitly lists synchronization with external audio among typical use cases.

### Lesson for BiliDJ

For Sync Lock, `requestVideoFrameCallback()` can provide better frame-aware measurements than relying only on `timeupdate`.

It still does not guarantee perfect hard-realtime synchronization, so product language should say “reduce drift / stay aligned” rather than “sample-accurate sync.”

## 8. Tab capture

Official reference:
https://developer.chrome.com/docs/extensions/reference/api/tabCapture

Tab capture can expose a tab MediaStream after explicit user invocation.

### Lesson for BiliDJ

Audio capture is technically possible but belongs later.

Hot Cue and Dual Deck do not need it. Adding it early would increase permission surface and audio-routing complexity.

## 9. Chrome Web Store policy

Official:
- https://developer.chrome.com/docs/webstore/program-policies/policies
- https://developer.chrome.com/docs/webstore/program-policies/permissions

Relevant constraints:
- extension purpose should be narrow and easy to understand,
- request the narrowest permissions necessary,
- privacy disclosures must match actual data handling,
- browsing activity access must be tied to the user-facing purpose.

### Lesson for BiliDJ

A good single-purpose sentence is:

> “Add performance controls—cueing and synchronized playback—to supported online video players.”

Hot Cue and Dual Deck fit one purpose. Downloader, unrelated scraping, recommendation feeds or generic automation do not.

## 10. Legacy BiliDJ prototype

The May 2026 code attempted:
- a full-screen Theater transformation,
- left current Bilibili video,
- right embedded Bilibili iframe,
- manual form-based cue creation,
- 657 lines of custom overlay styling,
- moving the host `<video>` element into extension DOM.

The design itself documented the fatal limitation: the right cross-origin iframe could not be reliably seeked or rate-controlled.

### Why it stalled

1. **The visual promise exceeded the technical control boundary.**
   It looked like two decks but only one was really controllable.

2. **The extension modified too much of the host page.**
   Re-parenting the site video makes SPA/player updates brittle.

3. **The simplest useful feature was buried.**
   Hot Cue required entering a custom mode and managing a form.

4. **The architecture was Bilibili-specific at the core.**
   Platform discovery and product behavior were intertwined.

5. **Generated store output was committed beside source.**
   This creates duplicate “truth” for agents and maintainers.

BiliDJ 2.0 is deliberately designed around correcting these failure modes.
