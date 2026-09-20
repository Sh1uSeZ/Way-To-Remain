/* โหลดรูปไว้ล่วงหน้า แล้วบอกได้ว่ารูปไหนพร้อมใช้แล้ว
   จำเป็นเพราะ <img> ที่เพิ่งถูกตั้ง src ใหม่ จะยังโชว์ "รูปเดิม" จนกว่ารูปใหม่จะ decode เสร็จ
   นับจำนวนที่โหลดเสร็จไว้ด้วย หน้า loading จะได้รู้ว่าเหลืออีกเท่าไหร่ */
(function () {
  const cache = new Map();
  const watchers = [];
  let total = 0, done = 0;

  function tick() {
    watchers.forEach((fn) => fn(done, total));
  }

  function image(url) {
    if (!url) return Promise.resolve(false);
    if (cache.has(url)) return cache.get(url).done;

    total++;
    const el = new Image();
    const finish = (res, ok) => { done++; tick(); res(ok); };
    const p = new Promise((res) => {
      el.onload  = () => finish(res, true);
      el.onerror = () => finish(res, false);
    });
    el.src = url;
    cache.set(url, { el, done: p });
    tick();
    return p;
  }

  window.Preload = {
    images: (urls) => Promise.all((urls || []).filter(Boolean).map(image)),

    isReady(url) {
      const e = cache.get(url);
      return !!(e && e.el.complete && e.el.naturalWidth > 0);
    },

    progress: () => ({ done: done, total: total }),
    onProgress(fn) { watchers.push(fn); },

    /* รอจนรูปที่สั่งไว้โหลดครบ เช็คซ้ำอีกรอบเผื่อระหว่างรอมีคนสั่งโหลดเพิ่ม */
    idle() {
      const wait = () => Promise.all([...cache.values()].map((e) => e.done));
      return wait().then(() => (done < total ? this.idle() : true));
    }
  };
})();
