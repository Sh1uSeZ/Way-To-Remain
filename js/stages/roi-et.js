(function () {
  const D = window.ROIET_DIALOG;

  Sound.bgm('bgm-roiet-khaen.mp3');
  Sound.amb('amb-roiet.mp3');

  let talkedToVillager = false;

  const dialog = window.createDialog({
    root:     document.getElementById('dialog'),
    dim:      document.getElementById('dim'),
    name:     document.getElementById('dialogName'),
    text:     document.getElementById('dialogText'),
    portrait: document.getElementById('dialogPortrait')
  }, onDialogClose);

  const panorama = window.createPanorama({
    world:    document.getElementById('world'),
    viewport: document.getElementById('viewport'),
    sceneW:   3965,
    sceneH:   1080,
    tag:      document.getElementById('tag'),
    labels:   D.tags,
    isBusy:   () => dialog.isOpen
  });

  function onHotspot(which) {
    if (dialog.isOpen || panorama.wasDragged()) return;

    if (which === 'villager') {
      dialog.open(D.villager);
    } else if (which === 'coffin') {
      if (talkedToVillager) window.goTo(D.villager.next);
      else                  dialog.open(D.coffinLocked);
    }
    panorama.refreshHover();
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
