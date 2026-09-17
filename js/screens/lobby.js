(function () {
  const board = document.getElementById('board');
  const hint  = document.getElementById('hint');
  const cards = document.querySelectorAll('.card--live');

  if (!window.IS_TOUCH) {
    window.createParallax(document.getElementById('camera'), 0.028, 1.09);
  }

  function focusCard(card) {
    board.style.transformOrigin = card.dataset.focusX + '% ' + card.dataset.focusY + '%';
    board.classList.add('is-zoomed');
    hint.textContent = card.dataset.label || '';
    hint.classList.add('is-visible');
  }

  function resetCamera() {
    board.classList.remove('is-zoomed');
    hint.classList.remove('is-visible');
  }

  if (window.IS_TOUCH) {
    // No hover on touch, so the first tap previews the stage and the second enters.
    let focused = null;
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        if (focused === card) { window.goTo(card.dataset.goto); return; }
        focused = card;
        focusCard(card);
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.card--live')) { focused = null; resetCamera(); }
    });
    return;
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => focusCard(card));
    card.addEventListener('focus',      () => focusCard(card));
    card.addEventListener('mouseleave', resetCamera);
    card.addEventListener('blur',       resetCamera);
    card.addEventListener('click', () => window.goTo(card.dataset.goto));
  });

  board.addEventListener('mouseleave', resetCamera);
})();
