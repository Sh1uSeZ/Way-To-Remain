(function () {
  const startBtn = document.getElementById('startBtn');
  const intro    = document.getElementById('intro');
  const video    = document.getElementById('introVideo');
  const skipBtn  = document.getElementById('skipBtn');

  if (!window.IS_TOUCH) {
    const REST = 1.07, HOVER = 1.20;
    const cam = window.createParallax(document.getElementById('cam'), 0.022, REST);
    startBtn.addEventListener('mouseenter', () => cam.zoom(HOVER));
    startBtn.addEventListener('focus',      () => cam.zoom(HOVER));
    startBtn.addEventListener('mouseleave', () => cam.zoom(REST));
    startBtn.addEventListener('blur',       () => cam.zoom(REST));
  }

  let done = false;

  function toLobby() {
    if (done) return;
    done = true;
    window.goTo('./lobby.html');
  }

  startBtn.addEventListener('click', () => {
    intro.classList.add('is-playing');
    video.play().catch(toLobby);
  });

  video.addEventListener('ended', toLobby);
  video.addEventListener('error', toLobby);
  skipBtn.addEventListener('click', toLobby);
})();
