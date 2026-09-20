/* โหลดรูปไว้ล่วงหน้า แล้วบอกได้ว่ารูปไหนพร้อมใช้แล้ว
   จำเป็นเพราะ <img> ที่เพิ่งถูกตั้ง src ใหม่ จะยังโชว์ "รูปเดิม" จนกว่ารูปใหม่จะ decode เสร็จ */
(function () {
  const cache = new Map();

  function image(url) {
    if (!url) return Promise.resolve(false);
    if (cache.has(url)) return cache.get(url).done;
    const el = new Image();
    const done = new Promise((res) => {
      el.onload  = () => res(true);
      el.onerror = () => res(false);
    });
    el.src = url;
    cache.set(url, { el, done });
    return done;
  }

  window.Preload = {
    images: (urls) => Promise.all((urls || []).filter(Boolean).map(image)),
    isReady(url) {
      const e = cache.get(url);
      return !!(e && e.el.complete && e.el.naturalWidth > 0);
    }
  };
})();
