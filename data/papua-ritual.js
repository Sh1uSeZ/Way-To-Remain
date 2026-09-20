/* พิธีศพ ด่านปาปัวนิวกินี — ของที่ถูกคือ คบเพลิง กับ โคลนแดงผสมไขมัน
   (พิธีรมควันศพของชาวที่ราบสูง)
   คบเพลิงพิเศษกว่าชิ้นอื่น นอกจากมีควันโผล่มาแล้ว ตัวศพยังเปลี่ยนเป็นภาพ "หลังเผา"
   ซึ่งคล้ำลงกว่าเดิม เลยต้องสลับ layer ไม่ใช่แค่วางทับ */
window.PAPUA_RITUAL = {
  stage: 'papua',
  title: 'พิธีศพ — ปาปัวนิวกินี',
  bg:    '../assets/ritual/bg.png',

  scene: {
    ratio: 1980 / 1080,
    cover: true,
    layers: [
      { id: 'bg',     src: '../assets/ritual/bg.png' },
      { id: 'bed',    src: '../assets/ritual/papua/bed.png' },
      { id: 'corpse', src: '../assets/ritual/papua/corpse.png' }
    ]
  },

  cast: { npc: { name: 'รองหัวหน้าเผ่า', portrait: '../assets/chars/papua-deputy-portrait.png' } },
  npc:  'npc',

  hint: 'เราจะไม่ฝังท่าน เราจะรมควันร่างท่านไว้ ให้ท่านเฝ้าหมู่บ้านต่อไป',

  correct: [
    { item: 'torch',
      art:  '../assets/ritual/papua/applied-smoke.png',
      swap: { layer: 'corpse', to: '../assets/ritual/papua/corpse-burnt.png' },
      say:  'ใช่แล้ว ก่อไฟไว้ใต้ร่าง ควันจะไล่ความชื้นออกไปจนหมด' },
    { item: 'clayFat',
      art:  '../assets/ritual/papua/applied-clay.png',
      say:  'ดี เคลือบร่างท่านด้วยโคลนแดงผสมไขมัน อากาศและแมลงจะเข้าไม่ถึง' }
  ],

  wrong: [
    'ไม่ใช่สิ่งนั้น วางลงก่อน อย่าให้ท่านต้องอับอาย',
    'เจ้าไม่รู้ธรรมเนียมของเรา ดูให้ดีแล้วค่อยหยิบใหม่',
    'หยุด นั่นไม่ใช่ของที่ใช้กับร่างของหัวหน้า'
  ],

  done: [
    'เสร็จแล้ว ท่านจะอยู่กับเราต่อไป ไม่ได้จากไปไหน',
    'ขอบคุณที่มาช่วย เจ้าจำวิธีของเราไว้ให้ดี'
  ],

  next: '../lobby.html'
};
