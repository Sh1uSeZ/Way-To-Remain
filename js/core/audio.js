/* เสียงทั้งเกม — ปรับระดับเสียงได้ที่ VOL ข้างล่างนี้ที่เดียว */
(function () {
  const VOL = {
    bgm: 0.18,   // แคน — เบา ๆ เป็นพื้นหลัง ไม่กลบบทสนทนา
    amb: 0.25,   // เสียงธรรมชาติ
    sfx: 0.55
  };
  /* เสียงคนในสนามบินตอนวิดิโอเปิด ต้องเบากว่า amb ปกติ
     เพราะในวิดิโอมีคนพูดไทยอยู่ ถ้าดังไปจะกลบเสียงพูด */
  const VOL_INTRO_AMB = 0.13;

  /* เสียงบางตัวดังกว่าตัวอื่นโดยธรรมชาติ ลดเฉพาะตัวนั้น */
  const QUIETER = { whoosh: 0.3 };
  const FADE_MS = 2200;
  const BASE = document.body.dataset.audioBase || './assets/audio/';

  const cache = {};
  const loops = [];

  /* cloneNode() ก๊อปแต่ตัว element ไม่ได้ก๊อปข้อมูลเสียงที่โหลดไว้ ตัวโคลนเลยต้องโหลดใหม่ทุกครั้ง
     ครั้งแรกของแต่ละเสียงจึงมักไม่ดัง ใช้เป็น pool ที่โหลดไว้แล้วแทน */
  const POOL = 3;

  function pool(name) {
    if (!cache[name]) {
      cache[name] = [];
      for (let i = 0; i < POOL; i++) {
        const a = new Audio(BASE + 'sfx-' + name + '.mp3');
        a.preload = 'auto';
        a.load();
        cache[name].push(a);
      }
    }
    return cache[name];
  }

  function play(name) {
    if (api.muted) return;
    const p = pool(name);
    const a = p.find((x) => x.paused || x.ended) || p[0];
    try { a.currentTime = 0; } catch (e) {}
    a.volume = VOL.sfx * (QUIETER[name] || 1);
    a.play().catch(() => {});
  }

  /* อุ่นเสียงทั้งหมดไว้ตั้งแต่เปิดหน้า จะได้ไม่มีเสียงไหนเงียบในครั้งแรก */
  function warm() {
    ['hover', 'confirm', 'paper', 'stamp', 'tick', 'thud', 'select', 'whoosh', 'error'].forEach(pool);
  }

  function loop(file, target) {
    const a = new Audio(BASE + file);
    a.loop = true;
    a.volume = 0;
    a.preload = 'auto';

    let started = false;
    function begin() {
      if (started || api.muted) return;
      a.play().then(() => {
        started = true;
        // ใช้ setInterval ไม่ใช่ rAF เพราะ rAF หยุดตอนสลับแท็บ แต่เสียงยังเล่นอยู่
        // ถ้าใช้ rAF แล้วผู้เล่นสลับแท็บกลางคัน เพลงจะค้างเบาหรือเงียบไปเลย
        const t0 = Date.now();
        clearInterval(a._fade);
        a._fade = setInterval(() => {
          if (api.muted) { a.volume = 0; return; }
          const k = Math.min(1, (Date.now() - t0) / FADE_MS);
          a.volume = target * k;
          if (k >= 1) clearInterval(a._fade);
        }, 50);
      }).catch(() => {});
    }

    // เบราว์เซอร์บล็อกเสียงจนกว่าผู้เล่นจะแตะหน้าจอ ถ้าโดนบล็อกก็รอ event แรก
    begin();
    ['pointerdown', 'keydown', 'touchstart'].forEach((e) =>
      window.addEventListener(e, begin, { once: true }));

    loops.push({ el: a, target });
    return a;
  }

  /* หยุดลูปแบบค่อยๆ เบาลง ใช้ตอนวิดิโอเปิดจบแล้วต้องตัดเสียงสนามบินทิ้ง
     ตัดปุบปับมันสะดุดหู แล้วต้องถอดออกจาก loops ด้วย
     ไม่งั้นกดปุ่มเสียงทีหลังมันจะกลับมาเล่นใหม่เอง */
  function stop(a, ms) {
    if (!a) return;
    clearInterval(a._fade);
    const from = a.volume, t0 = Date.now(), dur = ms || 500;
    a._fade = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / dur);
      a.volume = from * (1 - k);
      if (k >= 1) {
        clearInterval(a._fade);
        a.pause();
        const i = loops.findIndex((l) => l.el === a);
        if (i >= 0) loops.splice(i, 1);
      }
    }, 40);
  }

  const api = {
    muted: localStorage.getItem('wtr-muted') === '1',
    play,
    stop,
    bgm: (file) => loop(file, VOL.bgm),
    amb: (file, level) => loop(file, level == null ? VOL.amb : level),
    introAmb: (file) => loop(file, VOL_INTRO_AMB),
    // ลูปเป็น element ลอย ๆ ไม่อยู่ใน DOM หา element ตรง ๆ ไม่เจอ ถ้าเสียงมีปัญหาเรียกดูตรงนี้
    state: () => loops.map(({ el, target }) => ({
      file: el.src.split('/').pop(),
      playing: !el.paused,
      volume: +el.volume.toFixed(3),
      target
    })),
    toggleMute() {
      api.muted = !api.muted;
      try { localStorage.setItem('wtr-muted', api.muted ? '1' : '0'); } catch (e) {}
      loops.forEach(({ el, target }) => {
        el.volume = api.muted ? 0 : target;
        if (!api.muted && el.paused) el.play().catch(() => {});
      });
      document.documentElement.classList.toggle('is-muted', api.muted);
    }
  };

  warm();

  window.Sound = api;
  if (api.muted) document.documentElement.classList.add('is-muted');

  document.addEventListener('DOMContentLoaded', () => {
    const b = document.createElement('button');
    b.className = 'mute';
    b.type = 'button';
    b.setAttribute('aria-label', 'เปิด/ปิดเสียง');
    b.addEventListener('click', () => api.toggleMute());
    document.body.appendChild(b);
  });
})();
