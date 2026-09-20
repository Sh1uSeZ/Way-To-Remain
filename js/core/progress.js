/* ความคืบหน้าของผู้เล่น — ปลดล็อกด่านทีละด่าน ญี่ปุ่นอยู่ท้ายสุดเป็นตอนจบ

   ลำดับตามเลขที่ลูกค้าตั้งชื่อโฟลเดอร์มา
   ด่าน1 = กรุงเทพ, ด่าน2 = ร้อยเอ็ด, ด่าน3 = ปาปัวนิวกินี, ด่าน4 = ญี่ปุ่น
   อยากสลับลำดับ แก้ ORDER บรรทัดเดียวพอ ที่อื่นไม่ต้องแตะ */
(function () {
  const ORDER = ['bangkok', 'roiet', 'papua', 'japan'];
  const KEY = 'wtr:done';

  /* บางเครื่องปิด storage ไว้ (โหมดส่วนตัว / บล็อกคุกกี้) ถ้าพึ่ง localStorage อย่างเดียว
     ผู้เล่นจะติดอยู่ด่านแรกตลอดไป เลยมีตัวสำรองในหน่วยความจำไว้ให้เล่นจบได้ในรอบนั้น */
  let memory = null;

  function read() {
    if (memory) return memory.slice();
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      memory = [];
      return [];
    }
  }

  function write(list) {
    if (memory) { memory = list.slice(); return; }
    try { localStorage.setItem(KEY, JSON.stringify(list)); }
    catch (e) { memory = list.slice(); }
  }

  window.Progress = {
    order: ORDER.slice(),

    isDone: (id) => read().indexOf(id) >= 0,

    complete(id) {
      const list = read();
      if (list.indexOf(id) < 0) { list.push(id); write(list); }
    },

    /* ด่านแรกเปิดเสมอ ด่านถัดไปเปิดเมื่อผ่านด่านก่อนหน้าแล้ว */
    isUnlocked(id) {
      const i = ORDER.indexOf(id);
      if (i <= 0) return true;
      return read().indexOf(ORDER[i - 1]) >= 0;
    },

    isLast: (id) => ORDER[ORDER.length - 1] === id,
    allDone: () => ORDER.every((id) => read().indexOf(id) >= 0),
    reset() { write([]); }
  };
})();
