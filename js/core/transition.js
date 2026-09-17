/* Shared black-curtain page transition. */
(function () {
  const curtain = document.createElement('div');
  curtain.className = 'curtain is-visible';
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(curtain);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      curtain.classList.remove('is-visible');
    }));
  });

  /** Fade to black, then navigate. */
  window.goTo = function (url, delay = 560) {
    curtain.classList.add('is-visible');
    setTimeout(() => { window.location.href = url; }, delay);
  };
})();
