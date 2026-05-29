(() => {
  if (globalThis.__BILIDJ_BOOTED__) return;
  globalThis.__BILIDJ_BOOTED__ = true;

  let state = null;
  let cleanupHotkeys = null;
  let cleanupTicker = null;

  function ready() {
    return globalThis.BiliDJStorage && globalThis.BiliDJPlatform && globalThis.BiliDJBeat && globalThis.BiliDJUI && globalThis.BiliDJHotkeys;
  }

  function waitForVideo() {
    return new Promise(resolve => {
      const existing = globalThis.BiliDJPlatform.findMainVideo();
      if (existing) {
        resolve(existing);
        return;
      }
      const observer = new MutationObserver(() => {
        const video = globalThis.BiliDJPlatform.findMainVideo();
        if (video) {
          observer.disconnect();
          resolve(video);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(globalThis.BiliDJPlatform.findMainVideo());
      }, 8000);
    });
  }

  async function open() {
    if (state?.active) return;
    const video = globalThis.BiliDJPlatform.findMainVideo() || await waitForVideo();
    if (!video) {
      alert('BiliDJ 没有找到当前页面的视频播放器。请在 B站视频播放页使用。');
      return;
    }
    const settings = await globalThis.BiliDJStorage.getSettings();
    const left = globalThis.BiliDJPlatform.createTrack(video);
    state = {
      active: true,
      settings,
      left,
      root: null,
      originalVideoParent: null,
      originalVideoNext: null,
      originalVideoStyle: null,
      actions: {}
    };
    state.actions = {
      close,
      togglePlay: async () => {
        try {
          await state.left.playPause();
          state.actions.pulseTrack('L');
          state.actions.toast(state.left.video.paused ? '左轨暂停' : '左轨播放');
        } catch {
          state.actions.toast('浏览器拦住了播放。请先点一下左边视频，再点播放。');
        }
      },
      jumpToCue: cue => jumpToCue(cue),
      toast: message => globalThis.BiliDJUI.toast(state.root, message),
      pulseTrack: track => globalThis.BiliDJUI.pulse(state.root, track)
    };
    state.root = globalThis.BiliDJUI.createApp(state);
    cleanupHotkeys = globalThis.BiliDJHotkeys.bindHotkeys(state);
    cleanupTicker = globalThis.BiliDJUI.startTicker(state.root, state);
  }

  function close() {
    if (!state) return;
    cleanupHotkeys?.();
    cleanupTicker?.();
    cleanupHotkeys = null;
    cleanupTicker = null;
    globalThis.BiliDJUI.restoreVideo(state);
    globalThis.BiliDJUI.removeApp();
    state.active = false;
    state = null;
  }

  function jumpToCue(cue) {
    if (!state) return;
    if (cue.track === 'L') {
      state.left.seek(cue.time);
      state.actions.pulseTrack('L');
      state.actions.toast(`${cue.key}：左边视频跳到 ${cue.time}s`);
      return;
    }
    state.actions.pulseTrack('R');
    state.actions.toast('右边伴奏现在只能同框预览，暂时不能像左边一样精准跳秒');
  }

  async function boot() {
    if (!ready()) return;
    await waitForVideo();
    globalThis.BiliDJUI.createLauncher(open);
  }

  boot();
})();
