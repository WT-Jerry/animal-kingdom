(() => {
  const GATE = "a5f150a47c575251bc85ad72812f986669530759f4f4e43ad90e17a722c06adb";
  const KEY = "ak_gate";
  const inGuides = /\/guides\//.test(location.pathname);

  async function digest(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function authed() {
    return sessionStorage.getItem(KEY) === GATE;
  }

  async function unlock(password) {
    const h = await digest(password);
    if (h !== GATE) return false;
    sessionStorage.setItem(KEY, h);
    return true;
  }

  function goHome() {
    location.replace(inGuides ? "../index.html" : "index.html");
  }

  if (authed()) {
    document.documentElement.classList.add("ak-open");
    return;
  }

  if (inGuides) {
    goHome();
    return;
  }

  document.documentElement.classList.add("ak-locked");

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ak-form");
    const input = document.getElementById("ak-pass");
    const err = document.getElementById("ak-err");
    const film = document.querySelector(".ak-gate__film");
    const spk = document.getElementById("ak-spk");

    if (film && spk) {
      film.muted = true;
      const setSound = (on) => {
        film.muted = !on;
        spk.classList.toggle("is-on", on);
        spk.setAttribute("aria-pressed", on ? "true" : "false");
        spk.setAttribute("aria-label", on ? "關閉聲音" : "開啟聲音");
        if (on) film.play().catch(() => {});
      };
      spk.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSound(film.muted);
      });
    }

    if (!form || !input) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;
      const ok = await unlock(input.value);
      if (!ok) {
        err.hidden = false;
        input.value = "";
        input.focus();
        return;
      }
      document.documentElement.classList.remove("ak-locked");
      document.documentElement.classList.add("ak-open");
      const gate = document.getElementById("ak-gate");
      if (gate) gate.remove();
    });
    input.focus();
  });
})();
