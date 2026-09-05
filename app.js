const TRACKS = {
  preface: { title: "1. 前言", zone: "王國入口", duration: 98 },
  desert: { title: "2. 沙漠生態分區導覽", zone: "沙漠生態區", duration: 126 },
  camel: { title: "3. 駱駝", zone: "沙漠生態區", duration: 84 },
  fennec: { title: "4. 耳廓狐", zone: "沙漠生態區", duration: 71 },
  forest: { title: "5. 森林生態分區導覽", zone: "森林生態區", duration: 142 },
  gorilla: { title: "6. 大猩猩", zone: "森林生態區", duration: 88 },
  panda: { title: "7. 大貓熊", zone: "森林生態區", duration: 79 },
  heron: { title: "8. 蒼鷺", zone: "森林生態區", duration: 66 },
  panther: { title: "9. 黑豹", zone: "森林生態區", duration: 74 },
  "brown-bear": { title: "10. 棕熊", zone: "森林生態區", duration: 81 },
  ocean: { title: "11. 海洋生態分區導覽", zone: "海洋生態區", duration: 118 },
  grassland: { title: "12. 草原生態分區導覽", zone: "草原生態區", duration: 133 },
  hyena: { title: "13. 斑鬣狗", zone: "草原生態區", duration: 70 },
  elephant: { title: "14. 大象", zone: "草原生態區", duration: 92 },
  giraffe: { title: "15. 長頸鹿", zone: "草原生態區", duration: 77 },
  lion: { title: "16. 獅子", zone: "草原生態區", duration: 85 },
  prehistoric: { title: "17. 史前生命分區導覽", zone: "史前生命區", duration: 151 },
  trex: { title: "18. 暴龍", zone: "史前生命區", duration: 83 },
  herbivore: { title: "19. 植食性恐龍", zone: "史前生命區", duration: 90 },
  raptor: { title: "20. 迅猛龍", zone: "史前生命區", duration: 68 },
  pterosaur: { title: "21. 翼龍", zone: "史前生命區", duration: 72 },
  polar: { title: "22. 極地生態分區導覽", zone: "極地生態區", duration: 121 },
  seal: { title: "23. 海豹", zone: "極地生態區", duration: 64 },
  "musk-ox": { title: "24. 麝牛", zone: "極地生態區", duration: 76 },
  "polar-bear": { title: "25. 北極熊", zone: "極地生態區", duration: 89 },
  penguin: { title: "26. 企鵝", zone: "極地生態區", duration: 73 }
};

const ICON_PLAY = '<path d="M8 5.14v13.72L19 12 8 5.14z"/>';
const ICON_PAUSE = '<path d="M7 5h3.2v14H7V5zm6.8 0H17v14h-3.2V5z"/>';

const playToggle = document.getElementById("playToggle");
const playIcon = document.getElementById("playIcon");
const trackTitle = document.getElementById("trackTitle");
const trackZone = document.getElementById("trackZone");
const seek = document.getElementById("seek");
const tCur = document.getElementById("tCur");
const tDur = document.getElementById("tDur");
const volume = document.getElementById("volume");

let currentId = null;
let playing = false;
let elapsed = 0;
let lastTs = 0;
let volumeLevel = 0.8;

function fmt(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function setPressed() {
  document.querySelectorAll("[data-play]").forEach((el) => {
    if (el.classList.contains("audio-mini") || el.classList.contains("wave-btn") || el.classList.contains("nav-cta")) {
      el.setAttribute("aria-pressed", el.dataset.play === currentId && playing ? "true" : "false");
    }
  });
}

function loadTrack(id, autoplay) {
  const track = TRACKS[id];
  if (!track) return;
  currentId = id;
  elapsed = 0;
  lastTs = 0;
  trackTitle.textContent = track.title;
  trackZone.textContent = track.zone;
  tDur.textContent = fmt(track.duration);
  tCur.textContent = "0:00";
  seek.value = "0";
  seek.max = String(track.duration * 10);
  if (autoplay) start();
  else pause();
}

function start() {
  if (!currentId) loadTrack("preface", false);
  playing = true;
  lastTs = 0;
  playIcon.innerHTML = ICON_PAUSE;
  playToggle.setAttribute("aria-label", "暫停");
  setPressed();
}

function pause() {
  playing = false;
  playIcon.innerHTML = ICON_PLAY;
  playToggle.setAttribute("aria-label", "播放");
  setPressed();
}

function toggle() {
  if (!currentId) {
    loadTrack("preface", true);
    return;
  }
  if (playing) pause();
  else start();
}

playToggle.addEventListener("click", toggle);

document.querySelectorAll("[data-play]").forEach((el) => {
  el.addEventListener("click", () => {
    const id = el.dataset.play;
    if (currentId === id && playing) pause();
    else loadTrack(id, true);
  });
});

seek.addEventListener("input", () => {
  elapsed = Number(seek.value) / 10;
  tCur.textContent = fmt(elapsed);
});

volume.addEventListener("input", () => {
  volumeLevel = Number(volume.value) / 100;
  volume.setAttribute("aria-valuetext", `${volume.value}%`);
});

function tick(ts) {
  if (playing && currentId) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    const track = TRACKS[currentId];
    elapsed = Math.min(track.duration, elapsed + dt);
    seek.value = String(elapsed * 10);
    tCur.textContent = fmt(elapsed);
    if (elapsed >= track.duration) pause();
  }
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
