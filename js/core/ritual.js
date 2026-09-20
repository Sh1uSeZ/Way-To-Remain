/* มินิเกมจัดการศพ — ลากไอเทมจากแถบขวามาวางบนศพ
   ถูก  -> ของไปโผล่บนศพ NPC ชม
   ผิด  -> เสียงผิด NPC ด่า ของเด้งกลับ ไม่มีฉากแพ้ ไม่ต้องเริ่มใหม่
   ลากได้ทั้งเมาส์และนิ้ว ใช้ pointer event ตัวเดียวจบ */
(function () {
  const VISIBLE = 3;   /* แถบขวาโชว์ทีละกี่ช่อง ที่เหลือเลื่อนด้วยลูกศร */

  window.createRitual = function (cfg, els) {
    const ITEMS = window.RITUAL_ITEMS;
    const need  = cfg.correct.map((c) => c.item);
    const placed = [];
    let first = 0, drag = null, locked = false, finished = false, step = 0;
    /* ประกาศไว้บนสุด เพราะ buildScene() ถูกเรียกก่อนบรรทัดนี้ ถ้าไปประกาศทีหลังจะติด TDZ */
    const layerOf = {};

    /* ปิดบทสนทนาแล้ว ถ้าเป็นบทปิดจบ ให้จดว่าผ่านด่านนี้แล้วค่อยไปต่อ
       ด่านสุดท้าย (ญี่ปุ่น) ขึ้น The End ก่อนแล้วค่อยกลับหน้าแรก */
    const dialog = window.createDialog(els.dialog, (script) => {
      locked = false;
      if (!script || !script.done) return;
      if (cfg.stage && window.Progress) window.Progress.complete(cfg.stage);
      if (cfg.ending) theEnd(cfg.next);
      else goTo(cfg.next);
    });

    function theEnd(next) {
      const end = document.createElement('div');
      end.className = 'the-end';
      end.innerHTML = '<div class="the-end__word">The End</div>';
      document.body.appendChild(end);
      requestAnimationFrame(() => end.classList.add('is-in'));
      let gone = false;
      const leave = () => { if (gone) return; gone = true; goTo(next); };
      end.addEventListener('click', leave);
      setTimeout(leave, 4200);
    }

    buildScene();

    /* ด่านที่ไม่มีไอเทมให้ลาก (ญี่ปุ่น) เป็นฉากปิดเฉยๆ ซ่อนแถบของทิ้ง
       แล้วเล่นบทปิดเลย อ่านจบก็กลับหน้าเลือกด่าน */
    if (!cfg.correct.length) {
      els.rail.parentElement.style.display = 'none';
      if (cfg.hint) els.hint.textContent = cfg.hint;
      else els.hint.classList.add('is-hidden');
      if (window.Preload) {
        window.Preload.images(cfg.scene.layers.map((l) => l.src));
      }
      say(cfg.done, true);
      return dialog;
    }

    const strip = document.createElement('div');
    strip.className = 'rail__strip';
    els.rail.appendChild(strip);
    const slots = buildRail();
    layout();
    window.addEventListener('resize', layout);
    warm();
    paint();
    if (cfg.intro) say(cfg.intro, false);

    /* ---------- ฉาก ---------- */
    /* layer มีชื่อกำกับ เพราะบางด่านต้องสลับภาพชั้นเดิม ไม่ใช่แค่วางทับ
       เช่นปาปัว พอรมควันแล้วตัวศพจะคล้ำลง ต้องเปลี่ยนภาพศพทั้งใบ */
    function buildScene() {
      const s = cfg.scene;
      els.scene.style.setProperty('--scene-ar', s.ratio);
      els.scene.classList.add(s.cover ? 'scene--cover' : 'scene--fit');
      s.layers.forEach((l) => {
        const img = document.createElement('img');
        img.className = 'scene__layer';
        img.src = l.src;
        img.alt = '';
        /* ปกติ layer เป็นภาพเต็มแคนวาส 1980x1080 วางทับกันตรงๆ
           แต่บางตัวเป็นสไปรท์แยก (นางเอกด่านญี่ปุ่น) ต้องบอกตำแหน่งเอง */
        if (l.place) {
          img.classList.add('scene__layer--placed');
          Object.keys(l.place).forEach((k) => { img.style[k] = l.place[k]; });
        }
        els.scene.appendChild(img);
        layerOf[l.id] = img;
      });
      if (cfg.caption && els.caption) els.caption.textContent = cfg.caption;
      if (els.bg) els.bg.src = cfg.bg;
    }

    /* ---------- ช่องไอเทม ---------- */
    function buildRail() {
      return Object.keys(ITEMS).map((id) => {
        const item = ITEMS[id];
        const el = document.createElement('div');
        el.className = 'slot';
        el.dataset.item = id;
        el.innerHTML = '<img class="slot__icon" alt="">';
        el.querySelector('.slot__icon').src = item.icon;
        el.addEventListener('pointerenter', () => {
          tip(el, item.tip);
          if (!drag && !locked && window.Sound) window.Sound.play('tick');
        });
        el.addEventListener('pointerleave', hideTip);
        el.addEventListener('pointerdown', (e) => grab(e, id, el));
        strip.appendChild(el);
        return el;
      });
    }

    function warm() {
      if (!window.Preload) return;
      const urls = Object.keys(ITEMS).map((id) => ITEMS[id].icon)
        .concat(cfg.scene.layers.map((l) => l.src), [cfg.bg])
        .concat(cfg.correct.map((c) => c.art).filter(Boolean))
        .concat(cfg.correct.map((c) => c.swap && c.swap.to).filter(Boolean));
      window.Preload.images(urls);
    }

    /* ---------- tooltip ---------- */
    function tip(el, text) {
      if (drag) return;
      const r = el.getBoundingClientRect();
      els.tip.textContent = text;
      els.tip.style.top = (r.top + r.height / 2) + 'px';
      els.tip.style.right = (window.innerWidth - r.left + 14) + 'px';
      els.tip.classList.add('is-visible');
    }
    function hideTip() { els.tip.classList.remove('is-visible'); }

    /* ---------- เลื่อนแถบ ---------- */
    /* ช่องอยู่ครบทุกอันใน strip แล้วเลื่อน strip เอา ไม่ได้ซ่อนทีละช่อง
       จะได้ไถลให้เห็นว่าเลื่อนไปไหน ส่วนที่เกินโดน overflow ของ .rail บังไว้ */
    function layout() {
      if (slots.length < 2) return;
      step = slots[1].offsetTop - slots[0].offsetTop;
      els.rail.style.height =
        (step * (VISIBLE - 1) + slots[0].offsetHeight) + 'px';
      slide();
    }
    function slide() {
      strip.style.transform = 'translateY(' + (-first * step) + 'px)';
    }
    function paint() {
      slots.forEach((el) => {
        el.classList.toggle('is-used', placed.indexOf(el.dataset.item) >= 0);
      });
      slide();
      els.up.disabled   = first <= 0;
      els.down.disabled = first >= slots.length - VISIBLE;
    }
    els.up.addEventListener('click', () => { first = Math.max(0, first - 1); paint(); });
    els.down.addEventListener('click', () => {
      first = Math.min(slots.length - VISIBLE, first + 1); paint();
    });

    /* ---------- ลาก ---------- */
    function grab(e, id, el) {
      if (locked || finished || el.classList.contains('is-used')) return;
      e.preventDefault();
      hideTip();
      drag = { id, el };
      els.ghost.src = ITEMS[id].icon;
      els.ghost.classList.add('is-visible');
      if (window.Sound) window.Sound.play('select');
      move(e);
      el.setPointerCapture(e.pointerId);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', drop);
      el.addEventListener('pointercancel', drop);
    }

    function move(e) {
      els.ghost.style.left = e.clientX + 'px';
      els.ghost.style.top  = e.clientY + 'px';
      els.scene.classList.toggle('is-over', hit(e.clientX, e.clientY));
    }

    /* ghost บังอยู่ใต้ปลายเมาส์ ต้องซ่อนก่อนวัด ไม่งั้นเจอแต่ตัวมันเอง */
    function hit(x, y) {
      els.ghost.style.visibility = 'hidden';
      const t = document.elementFromPoint(x, y);
      els.ghost.style.visibility = '';
      return !!(t && els.scene.contains(t));
    }

    function drop(e) {
      if (!drag) return;
      const { id, el } = drag;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', drop);
      el.removeEventListener('pointercancel', drop);
      els.ghost.classList.remove('is-visible');
      els.scene.classList.remove('is-over');
      const ok = hit(e.clientX, e.clientY);
      drag = null;
      if (ok) use(id);
    }

    /* ---------- ตัดสินถูกผิด ---------- */
    function use(id) {
      const step = cfg.correct[need.indexOf(id)];
      if (!step || placed.indexOf(id) >= 0) return scold();
      placed.push(id);
      stick(step);
      paint();
      if (window.Sound) window.Sound.play('confirm');
      finished = placed.length === need.length;
      say(finished ? [step.say].concat(cfg.done) : [step.say], finished);
    }

    function scold() {
      if (window.Sound) window.Sound.play('error');
      const lines = cfg.wrong;
      say([lines[Math.floor(Math.random() * lines.length)]], false);
    }

    /* art = ภาพ "ตอนวางแล้ว" ที่ลูกค้าวาดมาเต็มแคนวาส วางทับได้เลย
       ถ้าไม่มี art ก็เอาไอคอนไปแปะตามพิกัดใน place
       ถ้าไม่มีทั้งคู่ แปลว่าของชิ้นนั้นไม่ต้องโชว์อะไร */
    function stick(step) {
      /* บางขั้นเปลี่ยนภาพชั้นเดิมแทนที่จะวางทับ รอให้ decode ก่อนค่อยสลับ
         ไม่งั้นจะเห็นภาพเก่าค้างเหมือนตอนสลับรูปตัวละคร */
      if (step.swap && layerOf[step.swap.layer]) {
        const img = layerOf[step.swap.layer], url = step.swap.to;
        const apply = () => { img.src = url; };
        if (window.Preload && window.Preload.isReady(url)) apply();
        else (window.Preload ? window.Preload.images([url]) : Promise.resolve()).then(apply);
      }
      if (!step.art && !step.place) return;
      const img = document.createElement('img');
      img.alt = '';
      if (step.art) {
        img.className = 'placed placed--full';
        img.src = step.art;
      } else {
        img.className = 'placed';
        img.src = ITEMS[step.item].icon;
        img.style.left  = step.place.left;
        img.style.top   = step.place.top;
        img.style.width = step.place.width;
        img.style.transform =
          'translate(-50%, -50%) rotate(' + (step.place.rotate || '0deg') + ')';
      }
      els.scene.appendChild(img);
      requestAnimationFrame(() => img.classList.add('is-in'));
    }

    function say(lines, done) {
      locked = true;
      dialog.open({
        cast:  cfg.cast,
        lines: lines.map((t) => ({ who: cfg.npc, text: t })),
        done:  done
      });
      if (done) els.hint.classList.add('is-hidden');
    }

    return dialog;
  };
})();
