/* script = { name, portrait, lines: [] } */
(function () {
  const TYPE_MS = 28;

  window.createDialog = function (els, onClose) {
    let lines = [], index = 0, typer = null, shown = '', script = null;

    const api = { isOpen: false, open, advance, close };

    function open(next) {
      script = next;
      lines  = next.lines;
      index  = 0;
      api.isOpen = true;

      els.name.textContent = next.name || '';
      if (next.portrait) { els.portrait.src = next.portrait; els.portrait.hidden = false; }
      else               { els.portrait.hidden = true; }

      els.dim.classList.add('is-open');
      els.root.classList.add('is-open');
      type(lines[0]);
    }

    function type(text) {
      clearInterval(typer);
      shown = '';
      els.text.textContent = '';
      let i = 0;
      typer = setInterval(() => {
        shown += text[i++];
        els.text.textContent = shown;
        if (i >= text.length) clearInterval(typer);
      }, TYPE_MS);
    }

    function advance() {
      if (!api.isOpen) return;
      // First click finishes the line, the next one moves on.
      if (shown.length < lines[index].length) {
        clearInterval(typer);
        shown = lines[index];
        els.text.textContent = shown;
        return;
      }
      index++;
      if (index < lines.length) { type(lines[index]); return; }
      close();
    }

    function close() {
      if (!api.isOpen) return;
      api.isOpen = false;
      clearInterval(typer);
      els.dim.classList.remove('is-open');
      els.root.classList.remove('is-open');
      if (onClose) onClose(script);
    }

    els.dim.addEventListener('click', advance);
    els.root.addEventListener('click', advance);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
    });

    return api;
  };
})();
