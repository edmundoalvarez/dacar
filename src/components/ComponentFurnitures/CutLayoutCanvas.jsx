import { useEffect, useRef } from "react";
import { drawLayout } from "../../utils/cutOptimizer/draw.js";

// Dibuja una placa (lamina) con sus piezas colocadas, a escala.
// Recibe el resultado del optimizador para un unico "bin".
function CutLayoutCanvas({
  sheetW,
  sheetH,
  trim = 0,
  placements = [],
  maxWidth = 560,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sheetW || !sheetH) return;

    const scale = maxWidth / sheetW;
    const dispW = Math.round(sheetW * scale);
    const dispH = Math.round(sheetH * scale);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dispW * dpr;
    canvas.height = dispH * dpr;
    canvas.style.width = `${dispW}px`;
    canvas.style.height = `${dispH}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, dispW, dispH);

    drawLayout(ctx, { sheetW, sheetH, scale, trim, placements });
  }, [sheetW, sheetH, trim, placements, maxWidth]);

  return <canvas ref={canvasRef} className="border border-gray-300 rounded" />;
}

export { CutLayoutCanvas };
