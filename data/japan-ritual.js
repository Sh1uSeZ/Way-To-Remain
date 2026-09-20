/* ฉากปิดด่านญี่ปุ่น — "ห้าปีต่อมา" ตามที่ลูกค้าสั่ง
   คุยกับพระจบแล้วเฟดมาที่ฉากนี้ นางเอกยืนมองร่างพระที่กลายเป็นโซกูชิมบุตสึแล้ว
   มุมบนซ้ายขึ้นคำว่า "ห้าปีต่อมา" แล้วขึ้นกล่องดำพูดประโยคเดียวจบ
   ไม่มีมินิเกม ไม่มีชื่อคนพูด เป็นกล่องดำเปล่าๆ ตามที่ลูกค้าเขียนมา */
window.JAPAN_RITUAL = {
  stage: 'japan',
  title: 'พิธีศพ — ญี่ปุ่น',
  bg:    '../assets/ritual/bg-japan.png',

  caption: 'ห้าปีต่อมา',

  scene: {
    ratio: 1980 / 1080,
    cover: true,
    layers: [
      { id: 'bg',   src: '../assets/ritual/bg-japan.png' },
      { id: 'monk', src: '../assets/ritual/japan/monk.png' },
      { id: 'hero', src: '../assets/ritual/japan/player.png',
        place: { left: '4%', bottom: '-4%', height: '82%' } }
    ]
  },

  /* ไม่มีคนพูด ขึ้นเป็นกล่องดำเฉยๆ */
  cast: {},
  npc:  null,

  hint: '',
  correct: [],
  wrong: [],

  done: [
    'ขอให้ความตั้งใจของท่านส่งถึงผู้คนด้วยนะคะ'
  ],

  ending: true,
  next: '../index.html'
};
