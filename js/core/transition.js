(function () {
  const curtain = document.createElement('div');
  curtain.className = 'curtain is-visible';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(curtain);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      curtain.classList.remove('is-visible');
    }));
  });

  window.goTo = function (url, delay = 560) {
    if (window.Sound) window.Sound.play('whoosh');
    curtain.classList.add('is-visible');
    setTimeout(() => { window.location.href = url; }, delay);
  };
})();
