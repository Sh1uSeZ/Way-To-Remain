/* ด่านกรุงเทพ — บทจากลูกค้า ส่วนที่เป็นบทเชื่อมเขียนเสริมเอง
   ลำดับ: กดคนในวัดก่อนจะได้แค่ "…" ต้องไปคุยเด็กก่อน แล้วค่อยกลับมาคุย */
window.BANGKOK_DIALOG = {

  cast: {
    child: { name: 'เด็กน้อย',  portrait: '../assets/chars/child-portrait.png',      side: 'left'  },
    monk:  { name: 'คนในวัด',   portrait: '../assets/chars/temple-man-portrait.png', side: 'left'  },
    hero:  { name: 'เรา',       portrait: '../assets/chars/hero-portrait.png',       side: 'right' }
  },

  child: {
    lines: [
      { who: 'child', text: 'พี่ๆ ดูตาหนูสิ บวมปูดจนแทบมองไม่เห็นทางแล้ว' },
      { who: 'hero',  text: 'เกิดอะไรขึ้นเหรอ' },
      { who: 'child', text: 'ไอ้คนในวัดนั่นแหละ มันใช้ให้หนูไปเก็บน้ำผึ้งมาให้\nหนูก็ไป... แล้วก็โดนผึ้งต่อยเต็มหน้าเลย' },
      { who: 'child', text: 'มันบอกว่าหนูตัวเล็ก ปีนต้นไม้เก่ง\nแต่มันไม่เคยขึ้นไปเองสักที' },
      { who: 'hero',  text: 'แล้วตอนนี้เขาอยู่ไหน' },
      { who: 'child', text: 'ในวัดนู่น นั่งอยู่เฉยๆ นั่นแหละ' }
    ]
  },

  monk: {
    lines: [
      { who: 'monk', text: 'ลูกเล็กเด็กแดงใครไม่รู้ เห็นคล่องแคล่วเลยวานให้ไปเก็บน้ำผึ้งมา\nก็แค่นั้น ผมไม่ได้ผิดอะไร' },
      { who: 'hero', text: 'เด็กตาบวมจนแทบไม่เห็นทางนะคะ' },
      { who: 'monk', text: 'ถ้าจะช่วยก็อย่าให้เป็นปัญหา อย่ามาเกะกะ' }
    ]
  },

  /* ยังไม่ได้คุยกับเด็ก — คนในวัดไม่พูดด้วย */
  monkLocked: {
    lines: [ { who: 'monk', text: '…' } ]
  },

  corpseLocked: {
    cast: {},
    lines: [ { who: null, text: 'ยังไม่ถึงเวลา...\nลองคุยกับคนแถวนี้ให้ครบก่อน' } ]
  },

  tags: { child: 'เด็กน้อย', monk: 'คนในวัด', corpse: 'ศพ' }
};
