# Go to market — BiliDJ

_Last updated: 2026-10-01_

This is a hypothesis document. Product proof comes before paid growth.

## Positioning

Avoid leading with “DJ software.”

That creates expectations around audio hardware, headphone cueing, low-latency routing, beat analysis and club reliability.

Lead with:

> **Turn any web video into a playable deck.**

Supporting message:

> Mark moments with 1–8. Pair two tabs. Make the internet perform.

For Chinese audiences:

> **把网页视频变成可以按键演奏的素材。**

and for the Dual Deck demo:

> **左边放 Beat，右边放一句人声，手动一对轴，就像他突然开始 Rap。**

## Beachhead audience

Priority:
1. remix/meme creators,
2. short-form editors,
3. beatmakers/producers,
4. creative coding / browser-extension users.

Professional DJs are credibility references, not the initial customer profile.

## The demo is the distribution unit

BiliDJ can be understood visually in seconds.

Best demo formats:

### Demo A — Hot Cue

A recognizable clip plays.

Creator presses:
```text
1 2 3 2 1
```

The person in the clip becomes a rhythmic “instrument.”

### Demo B — Speech becomes rap

Split-screen recording:
- left browser tab: beat,
- right browser tab: speech,
- Side Panel visible in the middle/right.

Show:
1. set A anchor,
2. set B anchor,
3. nudge 30 ms,
4. replay,
5. speech suddenly lands on beat.

This is likely the strongest launch demo because the value is obvious before viewers know what an extension is.

### Demo C — Any site

Fast cuts:
- Bilibili,
- TikTok,
- Douyin.

Same `1–8` interaction on all three.

Message:
> “Same muscle memory, wherever the clip lives.”

## Channels

### GitHub

Role:
- credibility,
- technical users,
- contributor funnel,
- issue/roadmap transparency.

README should contain a short GIF once Phase 1 works. Do not add a mockup GIF pretending future features already exist.

### Bilibili / Douyin / TikTok / Xiaohongshu

Role:
- product discovery.

Content should be result-first:
- “让新闻采访突然开始 freestyle”
- “不用下载视频，直接拿 B 站片段打碟”
- “我给 TikTok 加了 8 个 Hot Cue”
- “两个网页手动对轴是什么体验”

Avoid beginning with architecture explanations.

### Chrome Web Store / Edge Add-ons

Role:
- trust + install conversion.

Store copy should have a single purpose:
> Add Hot Cue and Dual Deck performance controls to supported online videos.

The permission list and privacy policy must match the shipping version.

Chrome policy references:
- https://developer.chrome.com/docs/webstore/program-policies/policies
- https://developer.chrome.com/docs/webstore/program-policies/permissions

## Growth hooks

Potential organic loops:
- export/share a cue map,
- share timestamped cue links,
- creator posts a “play this video with keys 1-8” preset,
- demo challenge: same speech over different beats,
- open-source platform adapters.

Do not build sharing before local cueing is reliable.

## Monetization benchmarks

YouTube Sampling is a useful narrow benchmark:
- free tier: 3 cues,
- Pro: 9 cues, loops, per-cue speed and labels,
- store listing shows $2.99/month or $14.99/year as of 2026-09-14.

Source:
https://chromewebstore.google.com/detail/youtube-sampling/oankfjpgnkaadhiacnljlflelobhjgef

This proves a small cue utility can at least test paid conversion. It does not prove BiliDJ should copy that exact gating or pricing.

## Monetization options

### Option A — open source + donations/sponsors

Pros:
- easiest fit with GitHub-first development,
- no account/payment complexity,
- community adapters can grow coverage.

Cons:
- weak direct revenue.

### Option B — generous free core + Pro performance features

Recommended if monetization is tested later.

Keep free:
- 8 Hot Cues,
- persistence,
- Bilibili/Douyin/TikTok adapters,
- manual Dual Deck.

Possible Pro:
- Sync Lock,
- loops/quantization,
- advanced cue banks,
- MIDI mappings,
- performance presets,
- session export/import,
- optional advanced audio modules.

Reasoning:
The viral core should remain shareable. Charging just to make the demo work would hurt adoption.

### Option C — creator toolkit / desktop companion later

Only evaluate if browser limitations become the bottleneck.

Do not start here.

## Open-source / license decision

The repository currently has no license.

Before accepting meaningful outside contributions or selling a Pro fork, explicitly choose:
- permissive license,
- copyleft,
- source-available,
- dual-license,
- or proprietary distribution.

Do not accidentally create a business model on top of ambiguous reuse rights.

## Launch gates

Do not publicly “launch” BiliDJ 2.0 from the docs alone.

### Alpha gate
- Bilibili Hot Cue works,
- no page takeover,
- reload persistence,
- one clean demo GIF/video.

### Cross-platform beta gate
- Bilibili + TikTok + Douyin Hot Cue,
- store-safe permissions,
- basic privacy text,
- crash/degraded states.

### Dual Deck launch gate
- two tabs assign reliably,
- anchors/replay work,
- manual nudge is understandable,
- at least one compelling speech+beat demo.

### Paid experiment gate
- repeated users exist,
- feature requests cluster around advanced performance capabilities,
- free core retention is understood,
- license/payment/privacy decisions are explicit.

## What not to market

Do not claim:
- sample-accurate synchronization,
- professional DJ replacement,
- support for “all websites,”
- lossless audio routing,
- guaranteed frame-perfect dual playback.

Say what the product actually does and let the demo carry the value.
