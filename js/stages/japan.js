(function () {
  const D = window.JAPAN_DIALOG;

  Sound.bgm('bgm-japan.mp3');

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
    if (which === 'monk') dialog.open(Object.assign({ cast: D.cast }, D.monk));
    panorama.refreshHover();
  }

  function onDialogClose(script) {
    if (script.lines === D.monk.lines) window.goTo(D.monk.next, 700);
  }

  document.querySelectorAll('.hotspot').forEach((hs) => {
    hs.addEventListener('click', () => onHotspot(hs.dataset.obj));
  });

  document.getElementById('backBtn')
          .addEventListener('click', () => window.goTo('../lobby.html'));
})();
