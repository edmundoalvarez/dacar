// Punto de entrada del optimizador de corte.
// Agrupa el despiece por placa (material), corre la optimizacion por grupo y
// devuelve los planes de corte con estadisticas y costo estimado de material.

import { optimize } from "./optimizer.js";

/**
 * Dimensiones reales de corte de una pieza segun su orientacion.
 * Se replica el criterio usado en el despiece existente (Furniture.jsx).
 * @param {Object} piece
 * @returns {{length:number, width:number}}
 */
function getCutDimensions(piece) {
  const length = Number(piece.length) || 0;
  const width = Number(piece.width) || 0;
  if (piece.orientation === "cross-horizontal") {
    return { length, width };
  }
  return { length: width, width: length };
}

/**
 * Expande una lista de piezas (con qty) a unidades individuales para empaquetar.
 * @param {Object[]} pieces
 * @param {boolean} allowRotation
 * @returns {import("./guillotine.js").PieceUnit[]}
 */
function expandPieces(pieces, allowRotation) {
  const units = [];
  pieces.forEach((piece, pIdx) => {
    const { length, width } = getCutDimensions(piece);
    const qty = Number(piece.qty) || 0;
    for (let i = 0; i < qty; i++) {
      units.push({
        id: `${piece._id || pIdx}-${i}`,
        name: piece.name,
        w: length,
        h: width,
        canRotate: allowRotation,
      });
    }
  });
  return units;
}

/**
 * Optimiza el corte de un despiece completo, agrupado por placa.
 *
 * @param {Object} params
 * @param {Object[]} params.pieces        Piezas del despiece (del backend)
 * @param {Object.<string,Object>} params.tablesByName  Placas indexadas por name
 * @param {number} [params.kerf=4]        Ancho de sierra en mm
 * @param {number} [params.trim=0]        Saneado por borde de la placa en mm
 * @param {boolean} [params.allowRotation=true]
 * @param {Object} [params.options]       Opciones del optimizador (iterations, seed...)
 * @returns {{materials: Object[], totals: Object}}
 */
export function optimizeCuts({
  pieces,
  tablesByName,
  kerf = 4,
  trim = 0,
  allowRotation = true,
  options = {},
}) {
  // Agrupar por material (== name de la placa).
  const groups = {};
  for (const piece of pieces) {
    const key = piece.material || "(sin material)";
    if (!groups[key]) groups[key] = [];
    groups[key].push(piece);
  }

  const materials = [];

  for (const [material, groupPieces] of Object.entries(groups)) {
    const table = tablesByName[material] || null;

    // Sin placa asociada: no podemos optimizar, todo queda pendiente.
    if (!table || !Number(table.length) || !Number(table.width)) {
      materials.push({
        material,
        table,
        bins: [],
        unfit: expandPieces(groupPieces, allowRotation).map((u) => ({
          ...u,
          reason: "Sin placa asociada o placa sin medidas",
        })),
        stats: {
          sheets: 0,
          usedArea: 0,
          sheetArea: 0,
          totalArea: 0,
          wastePct: 0,
          cost: 0,
        },
      });
      continue;
    }

    const sheetW = Number(table.length);
    const sheetH = Number(table.width);
    const usableW = Math.max(0, sheetW - 2 * trim);
    const usableH = Math.max(0, sheetH - 2 * trim);
    const price = parseFloat(String(table.price).replace(",", ".")) || 0;

    const units = expandPieces(groupPieces, allowRotation);
    const { bins, unfit } = optimize(units, usableW, usableH, kerf, options);

    // Desplazar las piezas por el saneado para el dibujo real de la placa.
    if (trim > 0) {
      for (const bin of bins) {
        for (const p of bin.placements) {
          p.x += trim;
          p.y += trim;
        }
      }
    }

    const sheets = bins.length;
    const usedArea = bins.reduce((acc, b) => acc + b.usedArea, 0);
    const sheetArea = sheetW * sheetH;
    const totalSheetArea = sheetArea * sheets;
    const wastePct =
      totalSheetArea > 0 ? (1 - usedArea / totalSheetArea) * 100 : 0;
    const cost = sheets * price;

    materials.push({
      material,
      table: {
        name: table.name,
        length: sheetW,
        width: sheetH,
        price,
      },
      bins,
      unfit,
      stats: {
        sheets,
        usedArea,
        sheetArea,
        totalArea: totalSheetArea,
        wastePct,
        cost,
      },
    });
  }

  const totals = materials.reduce(
    (acc, m) => {
      acc.sheets += m.stats.sheets;
      acc.cost += m.stats.cost;
      acc.unfit += m.unfit.length;
      return acc;
    },
    { sheets: 0, cost: 0, unfit: 0 }
  );

  return { materials, totals };
}
