(() => {
  function findMainVideo() {
    const videos = [...document.querySelectorAll('video')].filter(video => video.readyState >= 0);
    return videos.sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0] || null;
  }

  function getVideoIdFromUrl(url = location.href) {
    const match = url.match(/\/video\/(BV[\w]+)/i);
    return match ? match[1] : '';
  }

  function getPageTitle() {
    const title = document.querySelector('h1.video-title, h1[title], .video-title')?.textContent?.trim();
    return title || document.title.replace(/_哔哩哔哩_bilibili$/, '').trim() || 'Bilibili Vocal Track';
  }

  function createTrack(video) {
    return {
      video,
      id: getVideoIdFromUrl(),
      title: getPageTitle(),
      playPause() {
        if (video.paused) return video.play();
        video.pause();
        return Promise.resolve();
      },
      play() {
        return video.play();
      },
      pause() {
        video.pause();
      },
      seek(time) {
        video.currentTime = Math.max(0, Math.min(Number.isFinite(video.duration) ? video.duration : time, time));
      },
      shift(delta) {
        this.seek(video.currentTime + delta);
      },
      setVolume(value) {
        video.volume = Math.max(0, Math.min(1, value));
      },
      setRate(value) {
        video.playbackRate = Math.max(0.25, Math.min(2, value));
      },
      snapshot() {
        return {
          currentTime: video.currentTime || 0,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          paused: video.paused,
          volume: video.volume,
          rate: video.playbackRate || 1
        };
      }
    };
  }

  function formatTime(seconds) {
    const safe = Math.max(0, seconds || 0);
    const min = Math.floor(safe / 60).toString().padStart(2, '0');
    const sec = Math.floor(safe % 60).toString().padStart(2, '0');
    const tenth = Math.floor((safe % 1) * 10);
    return `${min}:${sec}.${tenth}`;
  }

  globalThis.BiliDJPlatform = { findMainVideo, createTrack, formatTime, getVideoIdFromUrl };
})();
