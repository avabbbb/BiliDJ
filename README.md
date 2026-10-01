# BiliDJ

> Turn any web video into a playable deck.

BiliDJ is being rebuilt from a Bilibili-only “theater mixer” prototype into a lightweight browser performance layer for online video.

The product has two core modes:

1. **Hot Cue** — mark moments on a video and trigger them instantly with the number keys.
2. **Dual Deck** — assign two open video tabs as Deck A / Deck B, manually align them, then keep them together with optional sync assistance.

The long-term target is Bilibili, Douyin, TikTok, and other compatible HTML5 video sites without downloading, re-hosting, or replacing the site’s media.

## Status

The repository currently contains a working **v0.1 Bilibili prototype**. It can control the current Bilibili video and store cue points, but its old right-hand “beat” player is an embedded cross-origin iframe and therefore cannot provide reliable dual-deck control.

The October 2026 restart is documented under [docs/](docs/README.md). The next implementation milestone is intentionally smaller: rebuild Hot Cue cleanly before adding cross-tab Dual Deck.

## Product direction

### Hot Cue

- Press an empty cue key to mark the current moment.
- Press a populated cue key to jump back instantly.
- Show persistent cue markers for the current video.
- Keep cue data local to the browser and scoped per media item.
- Never trigger shortcuts while the user is typing.

### Dual Deck

- Assign any supported open tab as Deck A or Deck B.
- Mark an anchor on each deck.
- Start both from the anchors.
- Nudge Deck B by small millisecond offsets until speech / beat alignment feels right.
- Later, optionally use a master clock and small playback-rate corrections to reduce drift.

## Why this is a restart

The old prototype physically moved the host page’s video into a full-screen custom UI and rendered the second track in a Bilibili iframe. That made the UI heavy while leaving the second track fundamentally uncontrollable.

BiliDJ 2.0 reverses those choices:

- **Do not re-parent the site video.**
- **Do not build the product around embedded iframes.**
- **Keep the original page visually intact.**
- **Use a compact performance overlay for Hot Cue.**
- **Use a persistent extension Side Panel for cross-tab Dual Deck control.**
- **Keep timing logic platform-agnostic; isolate site quirks in adapters.**

## Target architecture

```text
Supported video tab
  └─ Content Script
      ├─ Generic HTMLMediaElement controller
      ├─ Platform adapter (Bilibili / Douyin / TikTok)
      └─ Minimal in-page cue overlay
             │
             │ chrome.tabs.sendMessage / runtime messaging
             ▼
Extension Side Panel
  ├─ Deck A / Deck B assignment
  ├─ Manual offset controls
  ├─ Session state
  └─ Sync engine
             │
             ▼
chrome.storage.local / session

Service Worker
  └─ lifecycle, action click, registration and lightweight routing only
```

The service worker is deliberately **not** the realtime clock: Manifest V3 service workers may be suspended when idle.

## Repository docs

- [Product](docs/PRODUCT.md) — users, jobs-to-be-done, scope and success criteria.
- [Architecture](docs/ARCHITECTURE.md) — runtime boundaries, adapters, sync model and data model.
- [Interaction](docs/INTERACTION.md) — Hot Cue, Dual Deck, keyboard and UI behavior.
- [Research](docs/RESEARCH.md) — competitor / implementation research and lessons.
- [Roadmap](docs/ROADMAP.md) — staged implementation plan and acceptance gates.
- [Go to market](docs/GO_TO_MARKET.md) — positioning, distribution and monetization hypotheses.
- [History](docs/HISTORY.md) — what v0.1 tried, why it stalled, and what changed.
- [AGENTS.md](AGENTS.md) — coding-agent constraints and repository operating rules.

## Development

Current v0.1 development is intentionally simple:

```bash
npm run check
npm run package
```

For local Chrome / Edge testing:

1. Open the browser extensions page.
2. Enable developer mode.
3. Choose **Load unpacked**.
4. Select the repository root.
5. Open a Bilibili video page.

The build command produces store artifacts under `dist/`. Generated artifacts must not be committed.

## Product guardrails

BiliDJ is a controller for media the user is already viewing in their browser. The core product does **not** need to extract Bilibili/TikTok/Douyin CDN URLs, bypass access controls, or download protected media.

Permissions should remain narrow and tied to supported video sites. Do not add `<all_urls>` as a convenience shortcut.

## License

A project license has not yet been selected. Do not assume commercial, copyleft, or permissive reuse terms until a license is added.
