/* หน้าพิธีศพ ปาปัวนิวกินี — ต่อข้อมูลด่านเข้ากับตัวมินิเกมกลาง */
(function () {
  const R = window.PAPUA_RITUAL;

  Sound.bgm('bgm-ritual.mp3');

  document.getElementById('hint').textContent = R.hint;

  window.createRitual(R, {
    bg:    document.getElementById('ritualBg'),
    scene: document.getElementById('scene'),
    rail:  document.getElementById('rail'),
    up:    document.getElementById('railUp'),
    down:  document.getElementById('railDown'),
    tip:   document.getElementById('itemTip'),
    ghost: document.getElementById('ghost'),
    hint:  document.getElementById('hint'),
    dialog: {
      root: document.getElementById('dialog'),
      dim:  document.getElementById('dim'),
      name: document.getElementById('dialogName'),
      text: document.getElementById('dialogText'),
      char: document.getElementById('charSlot')
    }
  });

  document.getElementById('backBtn')
    .addEventListener('click', () => goTo('../lobby.html'));
})();
