/* หน้าจอโหลด
   - หน้าแรก (มี MANIFEST) โหลด asset ทั้งเกมรวดเดียว มีปุ่มข้ามให้กดถ้ารอไม่ไหว
   - หน้าอื่นรอแค่รูปของหน้าตัวเอง ซึ่งปกติจะอยู่ใน cache แล้วเลยผ่านฉิว
   ไม่รอเสียงให้ decode เสร็จ แค่ดึงลง cache พอ */
(function () {
  const CAP_MS  = 12000;   /* หน้าธรรมดา ถ้าไฟล์ไหนค้างก็ต้องปล่อยให้เล่นได้ */
  const SKIP_MS = 3000;    /* หน้าแรก โชว์ปุ่มข้ามหลังจากนี้ */
  const LANES   = 6;       /* ดึงพร้อมกันกี่ไฟล์ */

  const el = document.createElement('div');
  el.className = 'loader';
  el.innerHTML =
    '<div class="loader__box">' +
      '<div class="loader__label">กำลังโหลด</div>' +
      '<div class="loader__bar"><i></i></div>' +
      '<div class="loader__count"></div>' +
      '<button class="loader__skip" type="button">ข้ามการโหลด &rsaquo;</button>' +
    '</div>';

  let bar, count, skip, released = false;

  function show(pct, note) {
    if (!bar || released) return;
    bar.style.width = Math.min(100, Math.round(pct)) + '%';
    if (note) count.textContent = note;
  }

  function release() {
    if (released) return;
    released = true;
    el.classList.add('is-done');
    setTimeout(() => el.remove(), 600);
  }

  function mount() {
    document.body.appendChild(el);
    bar   = el.querySelector('.loader__bar i');
    count = el.querySelector('.loader__count');
    skip  = el.querySelector('.loader__skip');
    skip.addEventListener('click', release);
  }

  /* ---------- หน้าแรก: โหลดทั้งเกม ---------- */
  function bootAll(man) {
    const files = man.images.concat(man.audio);
    const total = files.reduce((n, f) => n + f[1], 0);
    const mb = (b) => (b / 1048576).toFixed(1);
    let got = 0, i = 0;

    setTimeout(() => el.classList.add('can-skip'), SKIP_MS);
    show(0, '0 / ' + mb(total) + ' MB');

    const lane = () => {
      if (i >= files.length || released) return Promise.resolve();
      const [url, bytes] = files[i++];
      return fetch(url, { cache: 'force-cache' })
        .then((r) => r.blob())
        .catch(() => null)
        .then(() => {
          got += bytes;
          show((got / total) * 100, mb(got) + ' / ' + mb(total) + ' MB');
          return lane();
        });
    };

    const lanes = [];
    for (let n = 0; n < LANES; n++) lanes.push(lane());
    return Promise.all(lanes).then(() => {
      /* ไฟล์อยู่ใน cache แล้ว สั่ง decode รูปต่อให้เลย จะได้ไม่ต้องรอตอนเปลี่ยนหน้า */
      if (window.Preload) window.Preload.images(man.images.map((f) => f[0]));
    });
  }

  /* ---------- หน้าอื่น: รอแค่รูปของหน้าตัวเอง ---------- */
  function pageOnly() {
    if (window.Preload) {
      window.Preload.onProgress((d, t) => {
        show(t ? (d / t) * 100 : 0, t ? d + ' / ' + t : '');
      });
      window.Preload.images([].map.call(document.images, (i) => i.currentSrc || i.src));
    }
    const loaded = new Promise((res) => {
      if (document.readyState === 'complete') return res();
      window.addEventListener('load', res, { once: true });
    });
    setTimeout(release, CAP_MS);
    return Promise.all([loaded, window.Preload ? window.Preload.idle() : null]);
  }

  function run() {
    mount();
    (window.MANIFEST ? bootAll(window.MANIFEST) : pageOnly()).then(release);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
