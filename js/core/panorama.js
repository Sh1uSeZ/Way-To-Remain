(function () {
  const EDGE  = 0.20;   // fraction of the viewport at each side that scrolls
  const SPEED = 1100;   // px per second at full deflection
  const TAP   = 12;     // px of travel still counted as a tap, not a drag

  window.createPanorama = function (opts) {
    let maxOffset = 0, offset = 0, last = 0;
    let mouseX = -1, mouseY = -1, hot = null;
    let dragging = false, dragFrom = 0, dragBase = 0, dragged = 0, swallowTap = false;

    function measure() {
      const worldW = window.innerHeight * (opts.sceneW / opts.sceneH);
      maxOffset = Math.max(0, worldW - window.innerWidth);
      opts.world.style.left =
        maxOffset === 0 ? ((window.innerWidth - worldW) / 2) + 'px' : '0px';
      offset = Math.min(offset, maxOffset);
    }

    function clamp(v) { return Math.max(0, Math.min(maxOffset, v)); }

    function onMove(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      opts.tag.style.left = mouseX + 'px';
      opts.tag.style.top  = mouseY + 'px';
    }

    function drive() {
      if (window.IS_TOUCH || opts.isBusy() || mouseX < 0) return 0;
      const r = mouseX / window.innerWidth;
      // Squared so it creeps near the boundary and speeds up at the very edge.
      if (r < EDGE)     return -Math.pow(1 - r / EDGE, 2);
      if (r > 1 - EDGE) return  Math.pow((r - (1 - EDGE)) / EDGE, 2);
      return 0;
    }

    /* mouseenter/mouseleave miss this: the scene slides under a cursor that never
       moves, so what is under the pointer changes without a mouse event. */
    function updateHover() {
      if (window.IS_TOUCH) return;
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

    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const dir = drive();
      if (!dragging) offset = clamp(offset + dir * SPEED * dt);
      opts.world.style.transform = 'translate3d(' + (-offset) + 'px,-50%,0)';

      opts.viewport.classList.toggle('is-edge-left',  dir < 0 && offset > 0);
      opts.viewport.classList.toggle('is-edge-right', dir > 0 && offset < maxOffset);

      updateHover();
      requestAnimationFrame(tick);
    }

    opts.viewport.addEventListener('touchstart', (e) => {
      if (opts.isBusy()) return;
      dragging = true; dragged = 0;
      dragFrom = e.touches[0].clientX;
      dragBase = offset;
    }, { passive: true });

    opts.viewport.addEventListener('touchmove', (e) => {
      if (!dragging || opts.isBusy()) return;
      const dx = e.touches[0].clientX - dragFrom;
      dragged = Math.max(dragged, Math.abs(dx));
      offset = clamp(dragBase - dx);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      dragging = false;
      // Swallow only the click this drag is about to emit, then forget it —
      // otherwise stale drag distance eats a later tap.
      swallowTap = dragged > TAP;
      setTimeout(() => { swallowTap = false; }, 400);
    }, { passive: true });

    window.addEventListener('resize', measure);
    window.addEventListener('mousemove', onMove);
    measure();
    requestAnimationFrame(tick);

    return { refreshHover: updateHover, wasDragged: () => swallowTap };
  };
})();
