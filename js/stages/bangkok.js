(function () {
  const D = window.BANGKOK_DIALOG;

  /* คนในวัดจะไม่พูดด้วยจนกว่าจะไปฟังเด็กก่อน */
  let heardChild = false;
  let heardMonk  = false;

  const dialog = window.createDialog({
    root:  document.getElementById('dialog'),
    dim:   document.getElementById('dim'),
    name:  document.getElementById('dialogName'),
    text:  document.getElementById('dialogText'),
    left:  document.getElementById('charLeft'),
    right: document.getElementById('charRight')
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

  function say(script) {
    dialog.open(Object.assign({ cast: D.cast }, script));
  }

  function onHotspot(which) {
    if (dialog.isOpen || panorama.wasDragged()) return;

    if (which === 'child')       say(D.child);
    else if (which === 'monk')   say(heardChild ? D.monk : D.monkLocked);
    else if (which === 'corpse') {
      if (heardChild && heardMonk) window.goTo('./bangkok-ritual.html');
      else say(D.corpseLocked);
    }
    panorama.refreshHover();
  }

  function onDialogClose(script) {
    if (script.lines === D.child.lines) heardChild = true;
    if (script.lines === D.monk.lines)  heardMonk  = true;
  }

  document.querySelectorAll('.hotspot').forEach((hs) => {
    hs.addEventListener('click', () => onHotspot(hs.dataset.obj));
  });

  document.getElementById('backBtn')
          .addEventListener('click', () => window.goTo('../lobby.html'));
})();
