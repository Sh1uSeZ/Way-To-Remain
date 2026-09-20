/* หน้าจอโหลด
   ใช้เฉพาะหน้าแรก โหลด asset ทั้งเกมให้ครบก่อนถึงจะเข้าเล่นได้
   รูป เสียง วิดิโอ ฟอนต์ ครบทุกอย่างตั้งแต่ตรงนี้
   หน้าอื่นไม่ต้องต่อไฟล์นี้เลย ของอยู่ใน cache หมดแล้ว จะได้ไม่มีจอดำแวบคั่นระหว่างเล่น */
(function () {
  const SKIP_MS = 3000;   /* โชว์ปุ่มข้ามหลังจากนี้ */
  const LANES   = 6;      /* ดึงพร้อมกันกี่ไฟล์ */

  const el = document.createElement('div');
  el.className = 'loader';
  el.innerHTML =
    '<div class="loader__box">' +
      '<div class="loader__label">กำลังโหลด</div>' +
      '<div class="loader__bar"><i></i></div>' +
      '<div class="loader__count"></div>' +
      '<button class="loader__skip" type="button">ข้ามการโหลด &rsaquo;</button>' +
    '</div>';

  let bar, count, mounted = false, released = false;

  function mount() {
    if (mounted || released) return;
    mounted = true;
    document.body.appendChild(el);
    bar   = el.querySelector('.loader__bar i');
    count = el.querySelector('.loader__count');
    el.querySelector('.loader__skip').addEventListener('click', release);
  }

  function show(pct, note) {
    if (!bar || released) return;
    bar.style.width = Math.min(100, Math.round(pct)) + '%';
    if (note != null) count.textContent = note;
  }

  function release() {
    if (released) return;
    released = true;
    if (!mounted) return;
    el.classList.add('is-done');
    setTimeout(() => el.remove(), 600);
  }

  /* ---------- หน้าแรก: โหลดทั้งเกมให้ครบ ---------- */
  function bootAll(man) {
    mount();
    const files = (man.images || []).concat(man.audio || [], man.video || []);
    const total = files.reduce((n, f) => n + f[1], 0) || 1;
    const mb = (b) => (b / 1048576).toFixed(1);
    let got = 0, i = 0;

    setTimeout(() => el.classList.add('can-skip'), SKIP_MS);
    show(0, '0.0 / ' + mb(total) + ' MB');

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

    return Promise.all(lanes)
      .then(() => Promise.all([
        /* ไฟล์อยู่ใน cache แล้ว สั่ง decode รูปต่อเลย จะได้ไม่ต้องรอตอนเปลี่ยนหน้า */
        window.Preload ? window.Preload.images((man.images || []).map((f) => f[0])) : null,
        /* ฟอนต์ไทยมาจาก Google Fonts ถ้าไม่รอ ตัวอักษรจะกระตุกเปลี่ยนหน้าตาทีหลัง */
        document.fonts ? document.fonts.ready : null
      ]));
  }

  function run() {
    if (!window.MANIFEST) return;   /* มีแค่หน้าแรกที่ต้องโหลด */
    bootAll(window.MANIFEST).then(release);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
