(() => {
  const ROOT_ID = 'bilidj-root';
  const BUTTON_ID = 'bilidj-launcher';

  function createLauncher(onOpen) {
    if (document.getElementById(BUTTON_ID)) return;
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.textContent = '进入 BiliDJ';
    button.addEventListener('click', onOpen);
    document.documentElement.appendChild(button);
  }

  function createApp(state) {
    removeApp();
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = `
      <div class="bilidj-shell" role="dialog" aria-modal="true" aria-label="BiliDJ 简单混音助手">
        <header class="bilidj-header">
          <div>
            <div class="bilidj-eyebrow">简单模式 / 三步完成</div>
            <h2>把这个视频配上一段伴奏</h2>
            <p class="bilidj-subtitle">不用懂 DJ：先选伴奏，再记住精彩位置，最后按键跳过去。</p>
          </div>
          <div class="bilidj-header-actions">
            <span class="bilidj-status" data-role="status">当前视频已准备好</span>
            <button class="bilidj-ghost" type="button" data-action="close" aria-label="退出 BiliDJ 并回到 B站页面">退出并回到 B站</button>
          </div>
        </header>

        <main class="bilidj-stage" aria-label="左右两个视频画面">
          <section class="bilidj-track bilidj-track-left" data-track-box="L" aria-label="左边是当前 B站视频">
            <div class="bilidj-track-label"><span>左边：当前视频</span><strong data-role="left-title"></strong></div>
            <div class="bilidj-video-slot" data-role="left-slot"></div>
            <div class="bilidj-timeline" data-role="left-timeline" aria-label="当前视频进度"><div data-role="left-progress"></div><div data-role="left-cues"></div></div>
            <div class="bilidj-time"><span data-role="left-time">00:00.0</span><span>可以播放、暂停、跳时间</span></div>
          </section>

          <section class="bilidj-track bilidj-track-right" data-track-box="R" aria-label="右边是伴奏视频">
            <div class="bilidj-track-label"><span>右边：伴奏视频</span><strong data-role="beat-title">还没选择伴奏</strong></div>
            <div class="bilidj-video-slot bilidj-beat-slot" data-role="beat-slot">
              <div class="bilidj-empty">
                <strong>第二步：选择一个伴奏</strong>
                <p>在右侧输入关键词搜索，或者直接粘贴 B站 BV号/链接。这里会显示伴奏视频。</p>
              </div>
            </div>
            <div class="bilidj-timeline bilidj-disabled"><div></div><div data-role="right-cues"></div></div>
            <div class="bilidj-time"><span>--:--.-</span><span>当前先作为同框预览</span></div>
          </section>
        </main>

        <aside class="bilidj-console" aria-label="操作面板">
          <section class="bilidj-card bilidj-help-card">
            <div class="bilidj-card-title">先看这里</div>
            <ol class="bilidj-steps">
              <li><strong>第一步</strong><span>左边视频已经自动放好了。</span></li>
              <li><strong>第二步</strong><span>搜索或粘贴一个伴奏，放到右边。</span></li>
              <li><strong>第三步</strong><span>给喜欢的位置设置按键，比如按 1 跳到 10 秒。</span></li>
            </ol>
          </section>

          <section class="bilidj-card bilidj-master">
            <div class="bilidj-card-title">播放控制</div>
            <div class="bilidj-control-grid">
              <button class="bilidj-primary" type="button" data-action="toggle-play">播放 / 暂停左边视频</button>
              <button class="bilidj-secondary" type="button" data-action="mark-current">把现在的位置记成快捷键</button>
            </div>
            <p class="bilidj-hint">提示：也可以按空格播放/暂停，按 A/D 后退或前进 2 秒。</p>
            <div class="bilidj-rate-row">
              <label for="bilidj-rate">左边视频速度 <output data-role="rate-output">1.00×</output></label>
              <input id="bilidj-rate" type="range" min="0.5" max="1.5" step="0.05" value="1" data-action="rate" aria-label="调整左边视频速度" />
            </div>
          </section>

          <section class="bilidj-card">
            <div class="bilidj-card-title">第二步：找伴奏</div>
            <label class="bilidj-field-label" for="bilidj-beat-input">输入想找的伴奏，或者粘贴 BV号/链接</label>
            <div class="bilidj-search-row">
              <input id="bilidj-beat-input" type="text" data-role="beat-input" placeholder="例如：爵士说唱伴奏 / BVxxxx" aria-describedby="bilidj-beat-help" />
              <button type="button" class="bilidj-secondary" data-action="search-beat">帮我找</button>
            </div>
            <p id="bilidj-beat-help" class="bilidj-hint">输入关键词会打开 B站搜索；粘贴 BV号会直接放到右边。</p>
            <div class="bilidj-chip-row" aria-label="常用伴奏搜索词">
              <button type="button" data-search="一滴泪 boom bap beat">Boom Bap</button>
              <button type="button" data-search="爵士说唱 beat instrumental">爵士说唱</button>
              <button type="button" data-search="R&B beat instrumental">R&B</button>
              <button type="button" data-search="经典说唱伴奏 beat">经典说唱</button>
            </div>
            <div class="bilidj-result" data-role="beat-result" aria-live="polite"></div>
          </section>

          <section class="bilidj-card bilidj-cues">
            <div class="bilidj-card-title-row">
              <div class="bilidj-card-title">第三步：设置一键跳转</div>
              <button type="button" class="bilidj-secondary" data-action="add-cue">新增快捷键</button>
            </div>
            <p class="bilidj-hint">例子：设置 “1 → 左边视频 → 10秒”，以后按 1 就会跳到 10 秒。</p>
            <div class="bilidj-cue-form" data-role="cue-form" hidden>
              <label><span>按键</span><input maxlength="1" data-role="cue-key" placeholder="1" aria-label="快捷键" /></label>
              <label><span>控制</span><select data-role="cue-track" aria-label="控制哪个视频"><option value="L">左边</option><option value="R">右边</option></select></label>
              <label><span>秒数</span><input type="number" min="0" step="0.1" data-role="cue-time" placeholder="10" aria-label="跳到第几秒" /></label>
              <label><span>名字</span><input data-role="cue-label" placeholder="副歌开始" aria-label="快捷键名称" /></label>
              <button type="button" class="bilidj-primary" data-action="save-cue">保存</button>
            </div>
            <div class="bilidj-cue-list" data-role="cue-list" aria-live="polite"></div>
          </section>
        </aside>
      </div>
      <div class="bilidj-toast" data-role="toast" role="status" aria-live="polite"></div>
    `;
    document.documentElement.appendChild(root);
    requestAnimationFrame(() => root.classList.add('bilidj-mounted'));
    mountVideo(root, state);
    bindUi(root, state);
    render(root, state);
    return root;
  }

  function mountVideo(root, state) {
    const slot = root.querySelector('[data-role="left-slot"]');
    const video = state.left.video;
    state.originalVideoParent = video.parentNode;
    state.originalVideoNext = video.nextSibling;
    state.originalVideoStyle = video.getAttribute('style');
    video.classList.add('bilidj-host-video');
    slot.appendChild(video);
  }

  function restoreVideo(state) {
    const video = state.left?.video;
    if (!video || !state.originalVideoParent) return;
    video.classList.remove('bilidj-host-video');
    if (state.originalVideoStyle === null) video.removeAttribute('style');
    else video.setAttribute('style', state.originalVideoStyle);
    state.originalVideoParent.insertBefore(video, state.originalVideoNext || null);
  }

  function removeApp() {
    document.getElementById(ROOT_ID)?.remove();
  }

  function bindUi(root, state) {
    root.querySelector('[data-action="close"]').addEventListener('click', state.actions.close);
    root.querySelector('[data-action="toggle-play"]').addEventListener('click', state.actions.togglePlay);
    root.querySelector('[data-action="mark-current"]').addEventListener('click', () => {
      const time = Number(state.left.video.currentTime.toFixed(1));
      const form = root.querySelector('[data-role="cue-form"]');
      form.hidden = false;
      root.querySelector('[data-role="cue-track"]').value = 'L';
      root.querySelector('[data-role="cue-time"]').value = String(time);
      root.querySelector('[data-role="cue-label"]').value = `左轨 ${globalThis.BiliDJPlatform.formatTime(time)}`;
      root.querySelector('[data-role="cue-key"]').focus();
    });
    root.querySelector('[data-action="rate"]').addEventListener('input', event => {
      const value = Number(event.target.value);
      state.left.setRate(value);
      root.querySelector('[data-role="rate-output"]').textContent = `${value.toFixed(2)}×`;
    });
    root.querySelector('[data-action="search-beat"]').addEventListener('click', () => runBeatSearch(root, state));
    root.querySelector('[data-role="beat-input"]').addEventListener('keydown', event => {
      if (event.key === 'Enter') runBeatSearch(root, state);
    });
    root.querySelectorAll('[data-search]').forEach(button => {
      button.addEventListener('click', () => {
        root.querySelector('[data-role="beat-input"]').value = button.dataset.search;
        runBeatSearch(root, state);
      });
    });
    root.querySelector('[data-action="add-cue"]').addEventListener('click', () => {
      const form = root.querySelector('[data-role="cue-form"]');
      form.hidden = !form.hidden;
      if (!form.hidden) root.querySelector('[data-role="cue-key"]').focus();
    });
    root.querySelector('[data-action="save-cue"]').addEventListener('click', () => saveCueFromForm(root, state));
  }

  function runBeatSearch(root, state) {
    const input = root.querySelector('[data-role="beat-input"]').value.trim();
    const parsed = globalThis.BiliDJBeat.normalizeInput(input);
    const result = root.querySelector('[data-role="beat-result"]');
    if (!parsed) {
      state.actions.toast('请先输入想找的伴奏，或者粘贴一个 BV号');
      return;
    }
    if (parsed.bvid) {
      loadBeat(root, state, parsed.bvid, globalThis.BiliDJBeat.titleFromInput(input));
      return;
    }
    result.innerHTML = `
      <div class="bilidj-search-result-card">
        <strong>搜索：${escapeHtml(parsed.keyword)}</strong>
        <p>我已经帮你准备好 B站搜索。点下面按钮，在新页面里找到喜欢的伴奏，复制它的 BV号或链接，再回到这里粘贴。</p>
        <a href="${parsed.url}" target="_blank" rel="noreferrer">去 B站搜索伴奏</a>
      </div>
    `;
  }

  async function loadBeat(root, state, bvid, title) {
    const slot = root.querySelector('[data-role="beat-slot"]');
    slot.innerHTML = `<iframe class="bilidj-beat-frame" src="${globalThis.BiliDJBeat.embedUrlFromBvid(bvid)}" allow="fullscreen; autoplay; encrypted-media" allowfullscreen></iframe>`;
    state.settings.beatUrl = `https://www.bilibili.com/video/${bvid}`;
    state.settings.beatTitle = title;
    await globalThis.BiliDJStorage.saveSettings(state.settings);
    render(root, state);
    state.actions.pulseTrack('R');
    state.actions.toast(`右轨已加载 ${title}`);
  }

  function saveCueFromForm(root, state) {
    const key = root.querySelector('[data-role="cue-key"]').value.trim().toUpperCase();
    const track = root.querySelector('[data-role="cue-track"]').value;
    const time = Number(root.querySelector('[data-role="cue-time"]').value);
    const label = root.querySelector('[data-role="cue-label"]').value.trim() || `${track} ${time}s`;
    if (!key || !Number.isFinite(time) || time < 0) {
      state.actions.toast('请填：按哪个键、跳到第几秒。比如 1 和 10');
      return;
    }
    upsertCue(root, state, { key: key.slice(0, 1), track, time, label });
    root.querySelector('[data-role="cue-form"]').hidden = true;
    root.querySelectorAll('[data-role="cue-key"], [data-role="cue-time"], [data-role="cue-label"]').forEach(input => input.value = '');
  }

  async function upsertCue(root, state, cue) {
    const index = state.settings.cues.findIndex(item => item.key.toUpperCase() === cue.key.toUpperCase());
    if (index >= 0) state.settings.cues[index] = cue;
    else state.settings.cues.push(cue);
    await globalThis.BiliDJStorage.saveSettings(state.settings);
    render(root, state);
    state.actions.toast(`已保存：按 ${cue.key} 跳到${cue.track === 'L' ? '左边视频' : '右边伴奏'} ${cue.time}s`);
  }

  async function deleteCue(root, state, key) {
    state.settings.cues = state.settings.cues.filter(cue => cue.key !== key);
    await globalThis.BiliDJStorage.saveSettings(state.settings);
    render(root, state);
    state.actions.toast(`已删除快捷键 ${key}`);
  }

  function render(root, state) {
    root.querySelector('[data-role="left-title"]').textContent = state.left.title;
    root.querySelector('[data-role="beat-title"]').textContent = state.settings.beatTitle || '未加载 Beat';
    renderCues(root, state);
    if (state.settings.beatUrl && !root.querySelector('.bilidj-beat-frame')) {
      const bvid = globalThis.BiliDJPlatform.getVideoIdFromUrl(state.settings.beatUrl);
      if (bvid) loadBeat(root, state, bvid, state.settings.beatTitle || bvid);
    }
  }

  function renderCues(root, state) {
    const list = root.querySelector('[data-role="cue-list"]');
    list.innerHTML = '';
    state.settings.cues.forEach(cue => {
      const row = document.createElement('div');
      row.className = 'bilidj-cue-row';
      row.innerHTML = `
        <span class="bilidj-key">${escapeHtml(cue.key)}</span>
        <span><strong>${escapeHtml(cue.label)}</strong><small>${cue.track === 'L' ? '左边视频' : '右边伴奏'} / 跳到 ${cue.time}s</small></span>
        <button type="button" data-jump="${escapeHtml(cue.key)}">试一下</button>
        <button type="button" data-delete="${escapeHtml(cue.key)}">删除</button>
      `;
      row.querySelector('[data-jump]').addEventListener('click', () => state.actions.jumpToCue(cue));
      row.querySelector('[data-delete]').addEventListener('click', () => deleteCue(root, state, cue.key));
      list.appendChild(row);
    });
    renderCuePins(root, state);
  }

  function renderCuePins(root, state) {
    const leftPins = root.querySelector('[data-role="left-cues"]');
    const rightPins = root.querySelector('[data-role="right-cues"]');
    leftPins.innerHTML = '';
    rightPins.innerHTML = '';
    const duration = state.left.snapshot().duration || 180;
    state.settings.cues.forEach(cue => {
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'bilidj-cue-pin';
      pin.textContent = cue.key;
      pin.style.left = `${Math.max(0, Math.min(100, cue.time / duration * 100))}%`;
      pin.addEventListener('click', () => state.actions.jumpToCue(cue));
      (cue.track === 'L' ? leftPins : rightPins).appendChild(pin);
    });
  }

  function startTicker(root, state) {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const snap = state.left.snapshot();
      const duration = snap.duration || 1;
      root.querySelector('[data-role="left-time"]').textContent = `${globalThis.BiliDJPlatform.formatTime(snap.currentTime)} / ${globalThis.BiliDJPlatform.formatTime(duration)}`;
      root.querySelector('[data-role="left-progress"]').style.width = `${Math.max(0, Math.min(100, snap.currentTime / duration * 100))}%`;
      requestAnimationFrame(tick);
    };
    tick();
    return () => { alive = false; };
  }

  function toast(root, message) {
    const el = root.querySelector('[data-role="toast"]');
    el.textContent = message;
    el.classList.add('bilidj-toast-on');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('bilidj-toast-on'), 1800);
  }

  function pulse(root, track) {
    const box = root.querySelector(`[data-track-box="${track}"]`);
    box.classList.remove('bilidj-pulse');
    void box.offsetWidth;
    box.classList.add('bilidj-pulse');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  globalThis.BiliDJUI = { createLauncher, createApp, removeApp, restoreVideo, startTicker, toast, pulse };
})();
