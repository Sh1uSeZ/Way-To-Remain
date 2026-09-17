/* Lobby: hovering a live card pushes the camera into that spot. */
(function () {
  const board = document.getElementById('board');
  const hint  = document.getElementById('hint');
  const cards = document.querySelectorAll('.card--live');

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

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => focusCard(card));
    card.addEventListener('focus',      () => focusCard(card));
    card.addEventListener('mouseleave', resetCamera);
    card.addEventListener('blur',       resetCamera);
    card.addEventListener('click', () => window.goTo(card.dataset.goto));
  });

  // Leaving the board entirely also pulls the camera back.
  board.addEventListener('mouseleave', resetCamera);
})();
