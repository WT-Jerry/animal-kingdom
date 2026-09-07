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
    audio.currentTime = Math.max(0, (audio.currentTime || 0) - 15);
    paint();
  });
  fwd15.addEventListener("click", () => {
    const t = (audio.currentTime || 0) + 15;
    const d = Number.isFinite(audio.duration) ? audio.duration : t;
    audio.currentTime = Math.min(d, t);
    paint();
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

  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");
  const LANG_META = {
    zh: { htmlLang: "zh-Hant", label: "語言：繁體中文" },
    en: { htmlLang: "en", label: "Language: English" }
  };

  const fileName = (url) => decodeURIComponent(String(url || "").split("/").pop() || "");

  const setLangMenu = (open) => {
    if (!langBtn || !langMenu) return;
    langMenu.hidden = !open;
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const applyLang = (lang) => {
    const next = LANG_META[lang] ? lang : "zh";
    const spec = LANG_META[next];
    document.documentElement.lang = spec.htmlLang;
    document.querySelectorAll("[data-lang-copy]").forEach((el) => {
      el.hidden = el.getAttribute("data-lang-copy") !== next;
    });
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-selected", btn.getAttribute("data-lang") === next ? "true" : "false");
    });
    langBtn.setAttribute("aria-label", spec.label);

    const nextSrc = audio.getAttribute(`data-src-${next}`);
    if (nextSrc && fileName(audio.currentSrc || audio.getAttribute("src")) !== fileName(nextSrc)) {
      const wasPlaying = !audio.paused && !audio.ended;
      const t = audio.currentTime || 0;
      const d = audio.duration || 0;
      const ratio = d > 0 ? t / d : 0;
      audio.src = nextSrc;
      const resume = () => {
        audio.removeEventListener("loadedmetadata", resume);
        if (ratio > 0 && audio.duration) {
          audio.currentTime = ratio * audio.duration;
        }
        audio.playbackRate = RATES[rateIndex];
        paint();
        if (wasPlaying) audio.play();
      };
      audio.addEventListener("loadedmetadata", resume);
      audio.load();
    }

    try {
      localStorage.setItem("ak-guide-lang", next);
    } catch (_) {
      /* ignore quota / private mode */
    }
  };

  if (langBtn && langMenu) {
    let stored = "zh";
    try {
      stored = localStorage.getItem("ak-guide-lang") || "zh";
    } catch (_) {
      stored = "zh";
    }
    applyLang(stored);

    langBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      setLangMenu(langMenu.hidden);
    });

    langMenu.addEventListener("click", (ev) => {
      const opt = ev.target.closest("[data-lang]");
      if (!opt) return;
      applyLang(opt.getAttribute("data-lang"));
      setLangMenu(false);
    });

    document.addEventListener("click", () => setLangMenu(false));
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") setLangMenu(false);
    });
  }
})();
