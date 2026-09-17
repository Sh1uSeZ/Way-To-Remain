(function () {
  function syncHeight() {
    document.documentElement.style.setProperty('--app-h', window.innerHeight + 'px');
  }
  syncHeight();
  window.addEventListener('resize', syncHeight);
  window.addEventListener('orientationchange', syncHeight);

  const coarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  window.IS_TOUCH = coarse;
  if (!coarse) return;

  document.documentElement.classList.add('is-touch');

  // The whole game is built around a wide frame, so portrait is not worth supporting.
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.createElement('div');
    el.className = 'rotate';
    el.innerHTML = '<div><div class="rotate__icon">⟲</div>' +
                   '<p>หมุนเครื่องเป็นแนวนอน<br>เพื่อเล่นเกม</p></div>';
    document.body.appendChild(el);
  });
})();
