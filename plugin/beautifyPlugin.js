Draw.loadPlugin(function (ui) {
  const graph = ui.editor.graph;
  console.log({ graph });

  // Add action
  ui.actions.addAction("genai-format", async function () {
    const model = graph.getModel();
    const cells = Object.values(model.cells).filter((c) => c.vertex || c.edge);
    const nodes = cells.map((cell) => {
      return {
        id: cell.id,
        label: cell.value?.toString?.() || "",
        type: cell.vertex ? "node" : "edge",
        source: cell.source?.id || null,
        target: cell.target?.id || null
      };
    });

    const res = await fetch("http://localhost:3000/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes })
    });

    const { positions } = await res.json(); // Expected: { [id]: {x, y} }

    model.beginUpdate();
    try {
      for (const id in positions) {
        const cell = model.getCell(id);
        const geo = cell.getGeometry();
        geo.x = positions[id].x;
        geo.y = positions[id].y;
        model.setGeometry(cell, geo);
      }
    } finally {
      model.endUpdate();
    }
  });

  // Add button to toolbar
  ui.toolbar.addSeparator();
  ui.toolbar.addItem("🧠 Format with AI", null, function () {
    ui.actions.get("genai-format").funct();
  });
});
