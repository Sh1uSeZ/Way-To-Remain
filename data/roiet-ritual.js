/* พิธีศพ ด่านร้อยเอ็ด — ของที่ถูกคือ ใบยาสูบ กับ ปูนขาว
   ลูกค้าวาดภาพ "ตอนวางแล้ว" มาให้ทั้งสองชิ้น วางทับได้เลยไม่ต้องจัดตำแหน่ง */
window.ROIET_RITUAL = {
  stage: 'roiet',
  title: 'พิธีศพ — ร้อยเอ็ด',
  bg:    '../assets/ritual/bg.png',

  scene: {
    ratio: 1980 / 1080,
    cover: true,
    layers: [
      { id: 'bg',     src: '../assets/ritual/bg.png' },
      { id: 'bed',    src: '../assets/ritual/roiet/bed.png' },
      { id: 'corpse', src: '../assets/ritual/roiet/corpse.png' }
    ]
  },

  cast: { npc: { name: 'ผู้เฒ่าคำ', portrait: '../assets/chars/villager-portrait.png' } },
  npc:  'npc',

  hint: 'อากาศฮ้อน กลิ่นเริ่มแฮง แมลงวันกะตอมหลาย — หาของมาดูแลร่างบักจ่อยแหน่',

  correct: [
    { item: 'tobacco',
      art:  '../assets/ritual/roiet/applied-tobacco.png',
      say:  'แม่นแล้ว เอาใบยาสูบรองไว้ใต้ร่าง นิโคตินมันสิช่วยดับกลิ่นได้อยู่' },
    { item: 'lime',
      art:  '../assets/ritual/roiet/applied-lime.png',
      say:  'ดีแล้ว โปรยปูนขาวไว้ แมลงสิบ่มาไข่ใส่ร่างบักจ่อย' }
  ],

  wrong: [
    'บ่แม่นเด้ ของสิ่งนั้นบ่ได้ใช้กับคนตายดอก เอาไปเก็บไว้ก่อน',
    'เจ้าเฮ็ดหยังของเจ้า บ้านเฮาบ่ได้ใช้แบบนั้น',
    'ค่อยๆ คิดแหน่ อย่าหยิบมั่วซั่ว ร่างคนตายบ่ใช่ของเล่น'
  ],

  done: [
    'เรียบร้อยแล้วเด้ ขอบใจหลาย',
    'เฮากะเฮ็ดได้แค่นี้ รอญาติพี่น้องมาให้ครบก่อน ค่อยส่งบักจ่อยไป'
  ],

  next: '../lobby.html'
};
