(function () {
  const LERP = 0.08;

  /* `frac` is a share of the shorter viewport edge, so the drift never exceeds
     the margin `scale` provides and no black edge is revealed. */
  window.createParallax = function (el, frac, scale) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let targetScale = scale, curScale = scale;

    function onMove(e) {
      const shift = Math.min(window.innerWidth, window.innerHeight) * frac;
      tx = (0.5 - e.clientX / window.innerWidth)  * 2 * shift;
      ty = (0.5 - e.clientY / window.innerHeight) * 2 * shift;
    }

    function tick() {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      curScale += (targetScale - curScale) * LERP;
      el.style.transform =
        'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0) scale(' + curScale.toFixed(4) + ')';
      requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMove);
    requestAnimationFrame(tick);

    return { zoom: (s) => { targetScale = s; } };
  };
})();
