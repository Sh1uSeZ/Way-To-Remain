/* ============================================================
   ด่านร้อยเอ็ด — ต่อสายระหว่างกล้องฉากกว้าง, hotspot และบทสนทนา
   ตรรกะทั่วไปอยู่ใน js/core/ บทพูดอยู่ใน data/roiet-dialog.js
   ============================================================ */
(function () {
  const D = window.ROIET_DIALOG;
  const SCENE_W = 3965, SCENE_H = 1080;

  let talkedToVillager = false;

  const dialog = window.createDialog({
    root:     document.getElementById('dialog'),
    dim:      document.getElementById('dim'),
    name:     document.getElementById('dialogName'),
    text:     document.getElementById('dialogText'),
    portrait: document.getElementById('dialogPortrait')
  }, onDialogClose);

  const panorama = window.createPanorama({
    world:  document.getElementById('world'),
    sceneW: SCENE_W,
    sceneH: SCENE_H,
    tag:    document.getElementById('tag'),
    labels: D.tags,
    isBusy: () => dialog.isOpen
  });

  function onHotspot(which) {
    if (dialog.isOpen) return;

    if (which === 'villager') {
      dialog.open(D.villager);
    } else if (which === 'coffin') {
      // โลงศพยังกดไม่ได้จนกว่าจะคุยกับผู้เฒ่าก่อน
      if (talkedToVillager) window.goTo(D.villager.next);
      else                  dialog.open(D.coffinLocked);
    }
    panorama.refreshHover();   // ปัดแสงเรืองออกก่อนที่ฉากจะถูกหรี่
  }

  function onDialogClose(script) {
    if (script !== D.villager) return;
    talkedToVillager = true;
    window.goTo(D.villager.next, 700);
  }

  document.querySelectorAll('.hotspot').forEach((hs) => {
    hs.addEventListener('click', () => onHotspot(hs.dataset.obj));
  });

  document.getElementById('backBtn')
          .addEventListener('click', () => window.goTo('../lobby.html'));
})();
