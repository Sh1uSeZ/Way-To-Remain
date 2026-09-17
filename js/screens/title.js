/* Title screen: Start → intro video → lobby. */
(function () {
  const startBtn = document.getElementById('startBtn');
  const intro    = document.getElementById('intro');
  const video    = document.getElementById('introVideo');
  const skipBtn  = document.getElementById('skipBtn');

  let done = false;

  function toLobby() {
    if (done) return;
    done = true;
    window.goTo('./lobby.html');
  }

  startBtn.addEventListener('click', () => {
    intro.classList.add('is-playing');
    // The click is the user gesture, so playback with audio is allowed here.
    video.play().catch(toLobby); // if the browser still blocks it, don't strand the player
  });

  video.addEventListener('ended', toLobby);
  video.addEventListener('error', toLobby);
  skipBtn.addEventListener('click', toLobby);
})();
