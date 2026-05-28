(() => {
  const KEY = 'bilidj.settings.v1';
  const defaults = {
    cues: [
      { key: '1', track: 'L', time: 0, label: '人声开头' },
      { key: '2', track: 'L', time: 15, label: '第一句' },
      { key: 'Q', track: 'R', time: 0, label: 'Beat 开头' }
    ],
    beatUrl: '',
    beatTitle: ''
  };

  async function getSettings() {
    const api = globalThis.chrome?.storage?.local;
    if (!api) return { ...defaults, cues: [...defaults.cues] };
    const data = await api.get(KEY);
    return { ...defaults, ...(data[KEY] || {}) };
  }

  async function saveSettings(settings) {
    const api = globalThis.chrome?.storage?.local;
    if (!api) return;
    await api.set({ [KEY]: settings });
  }

  globalThis.BiliDJStorage = { getSettings, saveSettings };
})();
