/* บทสนทนาสองฝั่งแบบ Persona
   script = {
     cast:  { key: { name, portrait, side: 'left'|'right' } },
     lines: [ { who: 'key', text: '...' } ]      // who: null = ไม่มีคนพูด
   } */
(function () {
  const TYPE_MS = 26;

  window.createDialog = function (els, onClose) {
    let lines = [], index = 0, typer = null, shown = '', script = null;

    const api = { isOpen: false, open, advance, close };

    function open(next) {
      script = next;
      lines = next.lines;
      index = 0;
      api.isOpen = true;
      els.dim.classList.add('is-open');
      els.root.classList.add('is-open');
      if (window.Sound) window.Sound.play('thud');
      show(0);
    }

    /* วางตัวละครเข้าที่ แล้วไฮไลต์เฉพาะฝั่งที่กำลังพูด */
    function cast(who) {
      const roles = (script.cast) || {};
      ['left', 'right'].forEach((side) => {
        const el = els[side];
        if (!el) return;
        const key = Object.keys(roles).find((k) => roles[k].side === side);
        const role = key ? roles[key] : null;

        if (!role || !role.portrait) {
          el.classList.remove('is-present', 'is-talking');
          return;
        }
        if (el.dataset.src !== role.portrait) {
          el.src = role.portrait;
          el.dataset.src = role.portrait;
        }
        el.classList.add('is-present');
        el.classList.toggle('is-talking', key === who);
      });

      const role = roles[who];
      els.name.textContent = '';
      if (role && role.name) {
        const s = document.createElement('span');
        s.textContent = role.name;
        els.name.appendChild(s);
      }
      els.name.classList.toggle('is-hidden', !(role && role.name));
    }

    function show(i) {
      const line = lines[i];
      cast(line.who);
      type(line.text);
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
      // คลิกแรกจบบรรทัดที่กำลังพิมพ์ คลิกถัดไปค่อยไปบรรทัดใหม่
      if (shown.length < lines[index].text.length) {
        clearInterval(typer);
        shown = lines[index].text;
        els.text.textContent = shown;
        return;
      }
      index++;
      if (window.Sound) window.Sound.play('select');
      if (index < lines.length) { show(index); return; }
      close();
    }

    function close() {
      if (!api.isOpen) return;
      api.isOpen = false;
      clearInterval(typer);
      els.dim.classList.remove('is-open');
      els.root.classList.remove('is-open');
      ['left', 'right'].forEach((s) => els[s] && els[s].classList.remove('is-present', 'is-talking'));
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
