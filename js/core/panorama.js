/* ============================================================
   กล้องฉากกว้าง — เลื่อนซ้ายขวาตามเมาส์ + ตรวจ hover ของ hotspot
   ใช้ซ้ำได้กับทุกด่านที่เป็นภาพยาว
   ============================================================ */
(function () {
  const LERP = 0.085;

  /**
   * @param {object} opts
   *   world   {HTMLElement}  กล่องที่บรรจุภาพฉากทั้งหมด
   *   sceneW  {number}       ความกว้างภาพต้นฉบับ (px)
   *   sceneH  {number}       ความสูงภาพต้นฉบับ (px)
   *   tag     {HTMLElement}  ป้ายชื่อที่ลอยตามเมาส์
   *   labels  {object}       { ชื่อ object: ข้อความบนป้าย }
   *   isBusy  {function}     คืน true เมื่อควรหยุดกล้องและ hover
   */
  window.createPanorama = function (opts) {
    let maxOffset = 0, current = 0, target = 0, pointerRatio = 0.5;
    let mouseX = -1, mouseY = -1, hot = null;

    function measure() {
      const worldW = window.innerHeight * (opts.sceneW / opts.sceneH);
      maxOffset = Math.max(0, worldW - window.innerWidth);
      // ฉากที่แคบกว่าจอ ให้จัดกลางแทนที่จะชิดซ้าย
      opts.world.style.left =
        maxOffset === 0 ? ((window.innerWidth - worldW) / 2) + 'px' : '0px';
      target = pointerRatio * maxOffset;
    }

    function onMove(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      opts.tag.style.left = mouseX + 'px';
      opts.tag.style.top  = mouseY + 'px';
      if (opts.isBusy()) return;          // ล็อกกล้องไว้ตอนมีบทสนทนา
      pointerRatio = Math.min(1, Math.max(0, mouseX / window.innerWidth));
      target = pointerRatio * maxOffset;
    }

    /* mouseenter/mouseleave ใช้ไม่ได้ที่นี่ เพราะฉากเลื่อนอยู่ใต้เมาส์ที่หยุดนิ่ง
       ทำให้ของเปลี่ยนใต้ปลายเมาส์โดยที่เมาส์ไม่ขยับ จึงต้องตรวจเองทุกเฟรม */
    function updateHover() {
      let next = null;
      if (!opts.isBusy() && mouseX >= 0) {
        const el = document.elementFromPoint(mouseX, mouseY);
        const hs = el && el.closest ? el.closest('.hotspot') : null;
        if (hs) next = hs.dataset.obj;
      }
      if (next === hot) return;

      if (hot) document.querySelector('.obj--' + hot).classList.remove('is-hot');
      hot = next;
      if (hot) {
        document.querySelector('.obj--' + hot).classList.add('is-hot');
        opts.tag.textContent = opts.labels[hot] || '';
        opts.tag.classList.add('is-visible');
      } else {
        opts.tag.classList.remove('is-visible');
      }
    }

    function tick() {
      // ค่อย ๆ ไล่เข้าหาเป้า ฉากจะได้ไหลลื่นแทนที่จะกระตุกตามเมาส์
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.05) current = target;
      opts.world.style.transform = 'translate3d(' + (-current) + 'px, -50%, 0)';
      updateHover();
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', measure);
    window.addEventListener('mousemove', onMove);
    measure();
    requestAnimationFrame(tick);

    return { refreshHover: updateHover };
  };
})();
