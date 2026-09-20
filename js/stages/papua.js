(function () {
  const D = window.PAPUA_DIALOG;

  let talked = false;

  const dialog = window.createDialog({
    root:  document.getElementById('dialog'),
    dim:   document.getElementById('dim'),
    name:  document.getElementById('dialogName'),
    text:  document.getElementById('dialogText'),
    char:  document.getElementById('charSlot')
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
    if (which === 'deputy') dialog.open(Object.assign({ cast: D.cast }, D.deputy));
    else if (which === 'corpse') {
      if (talked) window.goTo(D.deputy.next);
      else dialog.open(Object.assign({ cast: D.cast }, D.corpseLocked));
    }
    panorama.refreshHover();
  }

  function onDialogClose(script) {
    if (script.lines !== D.deputy.lines) return;
    talked = true;
    window.goTo(D.deputy.next, 700);
  }

  document.querySelectorAll('.hotspot').forEach((hs) => {
    hs.addEventListener('click', () => onHotspot(hs.dataset.obj));
  });
  document.getElementById('backBtn')
          .addEventListener('click', () => window.goTo('../lobby.html'));
})();
