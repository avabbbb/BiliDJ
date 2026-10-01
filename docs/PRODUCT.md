# Product — BiliDJ 2.0

_Last updated: 2026-10-01_

## One sentence

**BiliDJ turns the online video already open in your browser into a playable deck: mark moments, trigger them instantly, and pair two tabs for quick mashups.**

## The problem

Online video players are designed for watching. They are poor instruments.

A creator who hears a useful vocal, reaction, beat, phrase, or visual moment has to scrub a tiny seek bar repeatedly. If they want to combine a speech clip with a beat, they normally leave the browser for an editor or DAW even when the desired result is temporary, playful, or exploratory.

BiliDJ should remove that gap.

The intended feeling is:

> “I heard a moment. I hit a number. Now I can play it.”

And for two videos:

> “This speech almost fits that beat. I can align them in seconds without downloading either source.”

## Primary users

### 1. Remix / meme creators

They discover funny dialogue, speeches, interviews or reactions and want to perform them rhythmically.

Primary job: **turn browsing into a remix session before committing to an edit.**

### 2. Music producers and beatmakers

They use online video as inspiration or reference material.

Primary job: **bookmark and trigger moments with muscle memory instead of scrubbing.**

### 3. Short-form video creators / editors

They want to test whether a voice, scene or phrase works with a beat before downloading or importing media into a timeline.

Primary job: **rapid audition and timing exploration.**

### Secondary users

- streamers,
- VJs,
- educators demonstrating rhythm/timing,
- casual users who simply want better video bookmarks.

Professional club DJs are not the first target. Their reliability and audio-routing expectations are much higher than a browser extension should promise in v1.

## Product wedge

The wedge is **Hot Cue**, not “full browser DJ software.”

Hot Cue is:
- instantly understandable,
- useful on one video,
- cheap to implement,
- easy to demonstrate in a 10-second clip,
- a foundation for Dual Deck, Loop, Beat Grid and MIDI later.

Dual Deck is the second wedge because it creates the viral “speech becomes rap” demo and is differentiated from YouTube-only cue tools.

## Core modes

## Mode A — Hot Cue

Required:
- 8 cue slots in the first public version.
- Empty slot + trigger = mark current time.
- Populated slot + trigger = jump to time.
- Shift + trigger = clear.
- Persistent per-video storage.
- Visible marker/pad state.
- Works without opening a full control panel after initial activation.

Nice later:
- drag marker,
- cue labels,
- per-cue playback rate,
- loop from cue,
- quantize to beat grid,
- import/export cue sets.

## Mode B — Dual Deck

Required:
- choose Deck A and Deck B from open supported tabs,
- show title/platform/control health,
- set one anchor on each deck,
- start/stop both,
- nudge Deck B by small offsets,
- persist user offset during the session.

Later:
- swap master,
- Sync Lock,
- per-deck playback rate,
- BPM/beat grid,
- crossfader,
- audio routing,
- MIDI.

## Product principles

### 1. Performance before configuration

The common action must be a key press, not a form.

### 2. Website first

The user came to Bilibili/TikTok/Douyin to watch a video. BiliDJ augments the site instead of replacing it.

### 3. Real state only

Never display a fake waveform, fake deck state, fake sync lock or decorative “DJ” control that is not backed by a controllable media state.

### 4. Degrade honestly

A platform DOM change, autoplay block or inaccessible media should produce a visible degraded state. Do not silently claim success.

### 5. Local by default

Cue points and sessions should remain in browser storage unless a later sharing feature explicitly requires sync/export.

### 6. Cross-platform core, platform-specific edges

Timing logic should work with generic `HTMLMediaElement`. Site-specific adapters should be thin.

### 7. Permission restraint

The product is more trustworthy if it asks for only the sites and capabilities it actively supports.

## Scope boundaries

BiliDJ 2.0 is **not** initially:
- a downloader,
- a stem separator,
- a DAW,
- an audio editor,
- a media proxy,
- a DRM bypass,
- a full DJ replacement,
- a cloud account product.

If one of those becomes necessary, it requires a separate product decision rather than an incidental implementation.

## Success criteria

### Hot Cue MVP

A new user can:
1. load the unpacked extension,
2. open a Bilibili video,
3. arm BiliDJ,
4. press `1` to set a cue,
5. play forward,
6. press `1` again to return,
7. reload and still see the cue,

without reading documentation.

### Cross-platform milestone

The same Cue model and core controller pass equivalent tests on:
- Bilibili,
- Douyin,
- TikTok,

with site differences isolated in adapters.

### Dual Deck MVP

A user can:
1. assign two already-open tabs,
2. set an anchor on each,
3. hit Play Both,
4. nudge B by ±10/±100 ms,
5. replay the pairing from the aligned anchors,

without downloading either video.

## Product metrics

Do not over-instrument the extension early. Manual dogfood is more valuable than analytics before the interaction is stable.

Useful product metrics if analytics are added later with explicit disclosure:
- cue set → trigger ratio,
- repeat usage on another video,
- number of sessions reaching two assigned decks,
- median manual offset adjustments before replay,
- sync feature opt-in,
- uninstall reasons / permission complaints.

Avoid collecting browsing history merely because it is easy.

## Brand

Keep the repository/product name **BiliDJ** for now to preserve continuity.

The public descriptor should broaden it:

**BiliDJ — Browser Performance Layer**

or

**BiliDJ — Turn any web video into a deck**

If cross-platform adoption becomes the majority, a rename can be evaluated after the product works rather than before.
