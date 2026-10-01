# Roadmap — BiliDJ 2.0

_Last updated: 2026-10-01_

The roadmap is organized as mergeable product slices, not calendar promises.

A milestone is complete only when its acceptance gate is demonstrated on real sites.

## Phase 0 — Product / architecture reset

**Purpose:** remove ambiguity before rewriting code.

Deliverables:
- new README,
- AGENTS.md,
- product/architecture/interaction/research/GTМ docs,
- legacy design archived,
- generated `dist/` removed from source control,
- old Theater prototype moved to history.

Acceptance:
- one authoritative current design,
- old artifacts clearly marked historical,
- next PR can be implemented without consulting the legacy UI.

## Phase 1 — Hot Cue core on Bilibili

**Purpose:** close the smallest real user loop.

Implementation:
- introduce media controller,
- introduce schema-versioned Cue store,
- build 8-slot Cue engine,
- compact in-page cue overlay,
- performance-key arming,
- support SPA video changes,
- stop re-parenting the Bilibili video.

Interaction:
- 1–8 empty → set,
- 1–8 populated → trigger,
- Shift+1–8 → clear.

Acceptance:
- cue round trip works on at least 5 normal Bilibili videos,
- cue survives reload,
- switching to a new Bilibili video loads the correct cue set,
- comment/search input never triggers cues,
- no full-screen takeover,
- old iframe Beat flow is removed or isolated as legacy.

Suggested PR split:
1. core media/cue/storage model,
2. Bilibili adapter + overlay,
3. legacy Theater removal.

## Phase 2 — Platform adapter layer

**Purpose:** prove the core is really platform-neutral.

Add:
- `generic-html5`,
- TikTok adapter,
- Douyin adapter,
- shared media candidate scoring.

Acceptance:
- same Cue test contract passes on Bilibili/TikTok/Douyin,
- no platform selector inside Cue engine,
- short-video feed chooses the visibly active/playing media rather than an arbitrary node,
- route changes recover without extension reload.

## Phase 3 — Side Panel + Deck assignment

**Purpose:** establish the cross-tab product surface before sync.

Add:
- Side Panel,
- current-tab card,
- “Use current tab as A/B,”
- connected/degraded/disconnected state,
- deck title/platform/time snapshots,
- Play/Pause and seek-to-anchor per deck.

Acceptance:
- assign A, switch tabs, assign B while panel stays open,
- closing or navigating a deck tab is reflected correctly,
- service-worker restart does not destroy persistent Cue data,
- panel does not require a background process to remain permanently alive.

## Phase 4 — Manual Dual Deck Sync

**Purpose:** deliver the “speech becomes rap” use case.

Add:
- anchor A/B,
- Play Both,
- Replay From Anchors,
- B earlier/later ±10ms / ±100ms,
- user offset display,
- simple dispatch/seek timing diagnostics.

Acceptance:
- user can manually align the supplied speech/beat demo repeatedly,
- both decks report completed seek before replay attempts playback,
- autoplay failure identifies the failing deck,
- offset meaning is unambiguous in UI.

This is the first milestone that should be marketed as **Dual Deck**.

## Phase 5 — Sync Lock

**Purpose:** reduce drift after manual alignment.

Add:
- master deck,
- expected-time model,
- drift measurement,
- bounded soft playback-rate correction,
- hard-seek recovery,
- hysteresis / buffering suspension,
- visible sync state.

Acceptance:
- measured steady-state error improves over uncontrolled playback in repeatable tests,
- no sustained oscillation,
- playbackRate returns to nominal,
- Sync Lock can be disabled instantly,
- manual offset remains intact.

Do not promise “sample accurate.”

## Phase 6 — Performance expansion

Candidate order:
1. Loop In/Out.
2. Per-cue labels.
3. Cue drag/reposition.
4. Tap BPM.
5. Beat grid.
6. Quantized cue.
7. MIDI mapping.
8. Crossfader / volume controls.
9. Optional tab audio capture / recording.

Each item is a separate product decision.

## Not now

Do not prioritize:
- AI beat detection before manual cue/sync works,
- cloud accounts,
- social feed,
- built-in media download,
- stem separation,
- native desktop app,
- mobile,
- elaborate skin/theme system.

They can become valuable later, but none fix the current missing core loop.

## Validation cadence

After every phase, dogfood with real public videos and record:
- what action the user attempted,
- what the extension believed the media state was,
- what actually happened,
- any timing error in ms,
- whether page navigation broke the adapter.

Prefer one working slice over many partially wired features.
