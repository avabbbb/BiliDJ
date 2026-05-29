(() => {
  const KEY = 'bilidj.settings.v1';
  const defaults = {
    cues: [
      { key: '1', track: 'L', time: 0, label: '视频开头' },
      { key: '2', track: 'L', time: 15, label: '精彩位置' }
    ],
    beatUrl: '',
    beatTitle: ''
  };

  function cleanCue(cue) {
    const key = String(cue?.key || '').trim().toUpperCase().slice(0, 1);
    const time = Number(cue?.time);
    if (!key || !Number.isFinite(time) || time < 0) return null;
    return {
      key,
      track: 'L',
      time,
      label: String(cue?.label || `左边视频 ${time}s`).trim().slice(0, 40)
    };
  }

  function cleanSettings(value) {
    const cues = Array.isArray(value?.cues) ? value.cues.map(cleanCue).filter(Boolean) : defaults.cues;
    return {
      cues: cues.length ? cues : defaults.cues,
      beatUrl: String(value?.beatUrl || ''),
      beatTitle: String(value?.beatTitle || '').slice(0, 80)
    };
  }

  async function getSettings() {
    const api = globalThis.chrome?.storage?.local;
    if (!api) return cleanSettings(defaults);
    const data = await api.get(KEY);
    return cleanSettings({ ...defaults, ...(data[KEY] || {}) });
  }

  async function saveSettings(settings) {
    const api = globalThis.chrome?.storage?.local;
    if (!api) return;
    await api.set({ [KEY]: cleanSettings(settings) });
  }

  globalThis.BiliDJStorage = { getSettings, saveSettings };
})();
