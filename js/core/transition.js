(function () {
  const curtain = document.createElement('div');
  curtain.className = 'curtain is-visible';

  function reveal() { curtain.classList.remove('is-visible'); }

  function mount() {
    document.body.appendChild(curtain);
    /* rAF หยุดเดินตอนแท็บถูกซ่อน ถ้าพึ่งมันอย่างเดียวม่านดำจะค้างทั้งหน้า
       ดูเหมือนรูปโหลดไม่ขึ้น เลยตั้ง timeout กันไว้อีกชั้น */
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    setTimeout(reveal, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* กดย้อนกลับแล้วหน้าถูกดึงจาก bfcache ม่านจะดำค้างอยู่เหมือนกัน */
  window.addEventListener('pageshow', reveal);

  window.goTo = function (url, delay = 560) {
    if (window.Sound) window.Sound.play('whoosh');
    curtain.classList.add('is-visible');
    setTimeout(() => { window.location.href = url; }, delay);
  };
})();
