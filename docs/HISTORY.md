# History — from BiliDJ v0.1 to the 2.0 restart

## May 2026 — original prototype

The first BiliDJ prototype explored a visually ambitious idea:

- run only on Bilibili video pages,
- move the current page’s video into a custom full-screen Theater UI,
- put a second Bilibili video on the right as a “Beat” iframe,
- add search/BV input,
- save custom keyboard cue points,
- package the extension for Web Store testing.

The prototype also included a separate 41 KB HTML mockup styled as a Notion-like dual-deck workspace.

### What worked

- Direct control of the current page’s `<video>` was viable.
- `currentTime`, playback rate and cue persistence proved the Hot Cue concept.
- Browser-extension packaging and local storage were simple enough.
- The project identified the right general creator behavior: save a moment and trigger it again.

### What did not work

#### 1. The second deck was not really a deck

The second Bilibili video was loaded through a cross-origin iframe.

The design document itself acknowledged that the extension could not reliably seek or change playback rate inside it.

The UI therefore promised a two-deck product while the architecture only controlled one deck.

#### 2. The extension became a replacement UI

The code physically re-parented the site’s video element into BiliDJ’s DOM.

That is fragile on modern SPA video sites because the host application expects to own its player subtree.

#### 3. Cueing became configuration

The useful primitive — press a key and return to a moment — was wrapped in a large UI and a form asking for key, track, time and label.

This is slower than established Hot Cue interaction.

#### 4. The design was platform-specific at the wrong layer

Bilibili discovery, Beat search, UI and cue behavior were tightly coupled.

Adding TikTok or Douyin would have meant duplicating product logic instead of adding adapters.

#### 5. Source and generated artifacts were mixed

The repository committed `dist/bilidj-extension`, duplicating source and docs.

For humans and coding agents this creates multiple copies that can drift.

## October 2026 — restart

A new reference showed the desired Hot Cue interaction clearly: mark positions on a web video and trigger them with number keys.

The product scope was expanded:
- Bilibili,
- Douyin,
- TikTok,
- eventually generic HTML5 video.

A second use case was defined:
- Deck A = beat,
- Deck B = speech/voice,
- manually align anchors,
- replay them together so speech lands rhythmically,
- later reduce drift automatically.

## Architectural reset

The new design makes five explicit reversals.

| v0.1 | BiliDJ 2.0 |
| --- | --- |
| Full-screen Theater takeover | Website remains primary |
| Move host video into extension UI | Leave host media in place |
| Right-side cross-origin iframe | Two real tabs, each with its own content script |
| Bilibili behavior in core | Platform-neutral core + adapters |
| Background-like monolith | Content media controller + Side Panel session runtime |
| Form-driven cue creation | Empty pad sets, populated pad triggers |

## Historical artifacts

The old `DESIGN.md` is preserved under `docs/history/` as a snapshot.

The standalone Notion/Theater HTML prototype is also preserved there.

They are not current implementation requirements.

## Development path from here

1. Hot Cue core + Bilibili.
2. Generic adapter + TikTok/Douyin.
3. Side Panel + deck assignment.
4. Manual anchors and nudge.
5. Sync Lock.
6. Loop / Beat Grid / MIDI only after the core is proven.

The project should now progress by closing one observable user loop at a time rather than by expanding the visual shell.
