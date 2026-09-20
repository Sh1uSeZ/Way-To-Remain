(function () {
  const board = document.getElementById('board');
  const hint  = document.getElementById('hint');
  const cards = document.querySelectorAll('.card--live');

  /* ล็อกด่านที่ยังไปไม่ถึง ต้องเล่นไล่ทีละด่าน */
  const LOCK_MSG = 'ยังไปที่นี่ไม่ได้ — ต้องผ่านด่านก่อนหน้าให้เรียบร้อยก่อน';
  cards.forEach((card) => {
    const id = card.dataset.stage;
    if (!id || !window.Progress) return;
    card.classList.toggle('is-locked', !window.Progress.isUnlocked(id));
    card.classList.toggle('is-done',    window.Progress.isDone(id));
  });

  function locked(card) { return card.classList.contains('is-locked'); }

  function refuse(card) {
    Sound.play('error');
    hint.textContent = LOCK_MSG;
    hint.classList.add('is-visible');
  }

  if (!window.IS_TOUCH) {
    window.createParallax(document.getElementById('camera'), 0.028, 1.09);
  }

  function focusCard(card) {
    Sound.play('paper');
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
        if (locked(card)) { refuse(card); return; }
        if (focused === card) { Sound.play('stamp'); window.goTo(card.dataset.goto); return; }
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
    card.addEventListener('mouseenter', () => (locked(card) ? refuse(card) : focusCard(card)));
    card.addEventListener('focus',      () => (locked(card) ? refuse(card) : focusCard(card)));
    card.addEventListener('mouseleave', resetCamera);
    card.addEventListener('blur',       resetCamera);
    card.addEventListener('click', () => {
      if (locked(card)) { refuse(card); return; }
      Sound.play('stamp');
      window.goTo(card.dataset.goto);
    });
  });

  board.addEventListener('mouseleave', resetCamera);
})();
