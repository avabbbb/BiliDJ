(() => {
  function normalizeInput(input) {
    const value = input.trim();
    if (!value) return null;
    const bv = value.match(/BV[\w]+/i)?.[0];
    if (bv) return { bvid: bv, url: `https://www.bilibili.com/video/${bv}` };
    return { keyword: value, url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(value)}` };
  }

  function embedUrlFromBvid(bvid) {
    const params = new URLSearchParams({ bvid, autoplay: '0', high_quality: '1' });
    return `https://player.bilibili.com/player.html?${params.toString()}`;
  }

  function titleFromInput(input) {
    const parsed = normalizeInput(input);
    if (!parsed) return '';
    return parsed.bvid || parsed.keyword || input.trim();
  }

  globalThis.BiliDJBeat = { normalizeInput, embedUrlFromBvid, titleFromInput };
})();
