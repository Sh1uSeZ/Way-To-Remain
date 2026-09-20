/* ตอนจบของด่านสุดท้าย แยกจาก ritual.js เพราะเป็นลำดับฉากเฉพาะของตอนจบ
   ลูกค้าอยากให้เป็นซีนแยกกัน ค้างจังหวะก่อน แล้วค่อยขึ้นข้อความทีละบรรทัด

   beat หนึ่งก้อนทำได้หลายอย่าง
     hide     ซ่อน layer ในฉาก (เช่นให้นางเอกเฟดหายไป เหลือศพเดี่ยวๆ)
     caption  false = เก็บป้ายบอกเวลา
     lines    ขึ้นกล่องข้อความ รอผู้เล่นอ่านจบ
     epilogue เฟดดำ แล้วขึ้นข้อความกลางจอทีละบรรทัด
     hold     ค้างไว้กี่มิลลิวินาทีก่อนไป beat ถัดไป */
(function () {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  window.createOutro = function (els, dialog, layers) {

    function lines(list) {
      return new Promise((done) => {
        dialog.open({
          cast: {},
          lines: list.map((t) => ({ who: null, text: t })),
          after: done
        });
      });
    }

    async function epilogue(list) {
      const wrap = document.createElement('div');
      wrap.className = 'epilogue';
      document.body.appendChild(wrap);
      await wait(40);
      wrap.classList.add('is-in');
      await wait(1600);
      for (let i = 0; i < list.length; i++) {
        const p = document.createElement('p');
        p.className = 'epilogue__line';
        p.textContent = list[i];
        wrap.appendChild(p);
        await wait(40);
        p.classList.add('is-in');
        await wait(2800);
      }
      await wait(1200);
    }

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

    async function run(beats, next) {
      for (const b of (beats || [])) {
        if (b.hide) {
          b.hide.forEach((id) => { if (layers[id]) layers[id].classList.add('is-gone'); });
        }
        if (b.caption === false && els.caption) els.caption.classList.add('is-gone');
        if (b.hold) await wait(b.hold);
        if (b.lines) await lines(b.lines);
        if (b.epilogue) await epilogue(b.epilogue);
      }
      theEnd(next);
    }

    return { run: run, theEnd: theEnd };
  };
})();
