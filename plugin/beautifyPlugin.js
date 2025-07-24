Draw.loadPlugin(function (ui) {
  console.log("✅ Plugin loaded!");

  ui.toolbar.addItem("✨ Beautify", null, function () {
    alert("Plugin is working!");
  });
});
