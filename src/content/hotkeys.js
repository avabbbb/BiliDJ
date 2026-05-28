(() => {
  function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  function bindHotkeys(state) {
    function onKeydown(event) {
      if (!state.active || isTypingTarget(event.target)) return;
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      const cue = state.settings.cues.find(item => item.key.toUpperCase() === key.toUpperCase());
      if (cue) {
        event.preventDefault();
        state.actions.jumpToCue(cue);
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        state.actions.togglePlay();
        return;
      }
      if (event.code === 'KeyA') {
        event.preventDefault();
        state.left.shift(-2);
        state.actions.pulseTrack('L');
        state.actions.toast('左轨回退 2 秒');
        return;
      }
      if (event.code === 'KeyD') {
        event.preventDefault();
        state.left.shift(2);
        state.actions.pulseTrack('L');
        state.actions.toast('左轨快进 2 秒');
        return;
      }
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        event.preventDefault();
        state.actions.toast('右轨当前是 B站嵌入可视轨，暂不支持可靠 seek 控制');
      }
    }
    window.addEventListener('keydown', onKeydown, true);
    return () => window.removeEventListener('keydown', onKeydown, true);
  }

  globalThis.BiliDJHotkeys = { bindHotkeys };
})();
