/* หน้าจอดำตอนโหลด รอให้ "รูป" ของหน้านั้นพร้อมก่อนค่อยให้เล่น
   รอเฉพาะรูป ไม่รอเสียง เพราะ mp3 ก้อนละหลายเมกะไบต์และมันสตรีมได้อยู่แล้ว
   ถ้ารอเสียงด้วยจะต้องนั่งมองจอดำเพิ่มอีกหลายวินาทีโดยไม่ได้อะไรขึ้นมา */
(function () {
  const CAP_MS = 12000;   /* กันเหนียว ไฟล์ไหนโหลดไม่ขึ้นก็ต้องปล่อยให้เล่นได้ */

  const el = document.createElement('div');
  el.className = 'loader';
  el.innerHTML =
    '<div class="loader__box">' +
      '<div class="loader__label">กำลังโหลด</div>' +
      '<div class="loader__bar"><i></i></div>' +
      '<div class="loader__count"></div>' +
    '</div>';

  let bar, count, released = false;

  function mount() {
    document.body.appendChild(el);
    bar   = el.querySelector('.loader__bar i');
    count = el.querySelector('.loader__count');
    if (window.Preload) {
      window.Preload.onProgress(show);
      /* นับรูปที่อยู่ใน markup ด้วย ไม่งั้นหลอดจะเด้งไป 100% ทั้งที่ฉากยังโหลดไม่เสร็จ
         เรียกซ้ำ URL เดิมไม่ได้โหลดซ้ำ เบราว์เซอร์จ่ายจาก cache ให้ */
      window.Preload.images([].map.call(document.images, (i) => i.currentSrc || i.src));
    }
    show(window.Preload ? window.Preload.progress().done : 0,
         window.Preload ? window.Preload.progress().total : 0);
  }

  function show(done, total) {
    if (!bar || released) return;
    const pct = total ? Math.round((done / total) * 100) : 0;
    bar.style.width = pct + '%';
    count.textContent = total ? done + ' / ' + total : '';
  }

  function release() {
    if (released) return;
    released = true;
    el.classList.add('is-done');
    setTimeout(() => el.remove(), 600);
  }

  /* รอสองอย่าง: รูปที่อยู่ใน DOM ตั้งแต่แรก (window load) กับรูปที่สคริปต์สั่งโหลดเพิ่ม */
  function run() {
    mount();
    const loaded = new Promise((res) => {
      if (document.readyState === 'complete') return res();
      window.addEventListener('load', res, { once: true });
    });
    const imgs = window.Preload ? window.Preload.idle() : Promise.resolve();
    Promise.all([loaded, imgs]).then(release);
    setTimeout(release, CAP_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
