// Dibujo de un plano de corte sobre un contexto 2D (canvas en pantalla u
// offscreen para el PDF). Trabaja en pixeles de display: el llamador define el
// tamano del canvas y (opcionalmente) el scaling por devicePixelRatio.

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} params
 * @param {number} params.sheetW      Ancho real de la placa (mm)
 * @param {number} params.sheetH      Alto real de la placa (mm)
 * @param {number} params.scale       Factor px/mm
 * @param {number} [params.trim=0]    Saneado por borde (mm)
 * @param {Array}  params.placements  Piezas colocadas {x,y,w,h,name,rotated}
 */
export function drawLayout(ctx, { sheetW, sheetH, scale, trim = 0, placements }) {
  const dispW = sheetW * scale;
  const dispH = sheetH * scale;

  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, dispW, dispH);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, dispW - 1, dispH - 1);

  if (trim > 0) {
    ctx.strokeStyle = "#94a3b8";
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(
      trim * scale,
      trim * scale,
      (sheetW - 2 * trim) * scale,
      (sheetH - 2 * trim) * scale
    );
    ctx.setLineDash([]);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  placements.forEach((p) => {
    const x = p.x * scale;
    const y = p.y * scale;
    const w = p.w * scale;
    const h = p.h * scale;

    ctx.fillStyle = "#a7f3d0";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.fillStyle = "#064e3b";
    const cx = x + w / 2;
    const cy = y + h / 2;
    if (w > 46 && h > 26) {
      ctx.font = "10px sans-serif";
      ctx.fillText(p.name, cx, cy - 6, w - 4);
      ctx.font = "9px sans-serif";
      const dimText = `${Math.round(p.w)}x${Math.round(p.h)}${
        p.rotated ? " (R)" : ""
      }`;
      ctx.fillText(dimText, cx, cy + 6, w - 4);
    } else if (w > 24 && h > 14) {
      ctx.font = "8px sans-serif";
      ctx.fillText(`${Math.round(p.w)}x${Math.round(p.h)}`, cx, cy, w - 2);
    }
  });
}
