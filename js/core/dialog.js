/* บทสนทนาสองฝั่งแบบ Persona
   script = {
     cast:  { key: { name, portrait } },
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

    /* Persona วางตัวละครไว้ฝั่งเดียว พอเปลี่ยนคนพูดก็สลับตัวตรงนั้นเลย
       ไม่ได้โชว์สองคนพร้อมกัน */
    function cast(who) {
      const role = ((script.cast) || {})[who];
      const el = els.char;

      if (el) {
        if (!role || !role.portrait) {
          el.classList.remove('is-present', 'is-swapping');
        } else {
          const changed = el.dataset.src !== role.portrait;
          if (changed) {
            el.src = role.portrait;
            el.dataset.src = role.portrait;
          }
          el.classList.add('is-present');
          if (changed) {
            el.classList.remove('is-swapping');
            void el.offsetWidth;          // บังคับให้ animation เริ่มใหม่
            el.classList.add('is-swapping');
          }
        }
      }

      els.name.textContent = (role && role.name) || '';
      els.name.classList.toggle('is-hidden', !(role && role.name));
    }

    function show(i) {
      const line = lines[i];
      cast(line.who);
      // ยิง animation ใหม่ทุกบรรทัด ต้องถอดคลาสแล้วบังคับ reflow ก่อน ไม่งั้นมันไม่เล่นซ้ำ
      els.root.classList.remove('is-speaking');
      void els.root.offsetWidth;
      els.root.classList.add('is-speaking');
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
      els.root.classList.remove('is-open', 'is-speaking');
      if (els.char) els.char.classList.remove('is-present', 'is-swapping');
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
