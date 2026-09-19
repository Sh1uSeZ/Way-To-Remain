/* ด่านญี่ปุ่น — PLACEHOLDER รอบทจริงจากลูกค้า
   ลูกค้าระบุว่าด่านนี้ "เน้นคุย" แล้วค่อยตัดไปฉากพระนั่งสมาธิ */
window.JAPAN_DIALOG = {

  cast: {
    monk: { name: 'พระ', portrait: '../assets/chars/japan-monk-portrait.png' },
    hero: { name: 'เรา', portrait: '../assets/chars/hero-portrait.png' }
  },

  monk: {
    lines: [
      { who: 'monk', text: 'ที่นี่เงียบดีนะ... ใบไม้ร่วงเท่าไร ก็กวาดเท่านั้น' },
      { who: 'hero', text: 'ท่านกวาดอยู่ทุกวันเลยหรือคะ' },
      { who: 'monk', text: 'ทุกวัน และพรุ่งนี้ก็จะมีใบใหม่ร่วงลงมาอีก\nไม่มีวันไหนที่กวาดเสร็จจริง ๆ หรอก' },
      { who: 'hero', text: 'แล้วท่านไม่เหนื่อยหรือ' },
      { who: 'monk', text: 'การจากไปก็เหมือนกัน\nเราไม่ได้ทำให้มันหายไป เราแค่อยู่กับมันให้เป็น' },
      { who: 'monk', text: 'ถ้าอยากรู้ว่าที่นี่เขาส่งคนตายกันอย่างไร... ตามมาสิ' }
    ],
    next: './japan-ritual.html'
  },

  tags: { monk: 'พระ' }
};
