(() => {
  const audio = document.getElementById("guideAudio");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const seek = document.getElementById("seek");
  const tCur = document.getElementById("tCur");
  const tLeft = document.getElementById("tLeft");
  const rateBtn = document.getElementById("rateBtn");
  const back15 = document.getElementById("back15");
  const fwd15 = document.getElementById("fwd15");
  const ICON_PLAY = '<path d="M9 6.2v11.6L19 12 9 6.2z"/>';
  const ICON_PAUSE = '<path d="M8 6h3.1v12H8V6zm4.9 0H16v12h-3.1V6z"/>';
  const RATES = [1, 1.25, 1.5, 0.75];
  let rateIndex = 0;

  const fmt = (sec) => {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const s = Math.floor(sec);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const paint = () => {
    const d = audio.duration || 0;
    const t = audio.currentTime || 0;
    seek.max = String(Math.floor(d * 10) || 0);
    seek.value = String(Math.floor(t * 10));
    tCur.textContent = fmt(t);
    tLeft.textContent = d ? `-${fmt(d - t)}` : "-0:00";
  };

  const setPlaying = (on) => {
    playIcon.innerHTML = on ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute("aria-label", on ? "暫停" : "播放");
  };

  playBtn.addEventListener("click", () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => setPlaying(false));
  audio.addEventListener("timeupdate", paint);
  audio.addEventListener("loadedmetadata", paint);

  seek.addEventListener("input", () => {
    audio.currentTime = Number(seek.value) / 10;
    paint();
  });

  back15.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  });
  fwd15.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
  });

  rateBtn.addEventListener("click", () => {
    rateIndex = (rateIndex + 1) % RATES.length;
    audio.playbackRate = RATES[rateIndex];
    rateBtn.textContent = `${RATES[rateIndex]}x`;
  });

  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-tab");
      document.querySelectorAll("[data-tab]").forEach((b) => {
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      document.getElementById("panel-intro").hidden = id !== "intro";
      document.getElementById("panel-script").hidden = id !== "script";
      document.querySelector(".tab-rule").dataset.tab = id;
    });
  });

  const sizeBtn = document.getElementById("typeSize");
  if (sizeBtn) {
    const steps = [1, 1.08, 1.16];
    let i = 0;
    sizeBtn.addEventListener("click", () => {
      i = (i + 1) % steps.length;
      document.documentElement.style.setProperty("--read", String(steps[i]));
      document.querySelectorAll(".panel").forEach((p) => {
        p.style.fontSize = `calc(0.98rem * ${steps[i]})`;
      });
    });
  }
})();
