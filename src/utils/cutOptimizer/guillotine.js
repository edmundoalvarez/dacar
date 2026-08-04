// Colocador guillotina (2D bin packing) de una pasada.
// Trabaja con rectangulos y cortes de borde a borde (guillotina), contemplando
// el ancho de sierra (kerf) y rotacion opcional por pieza.
//
// Todas las medidas estan en las mismas unidades (mm en este proyecto).

/**
 * @typedef {Object} PieceUnit
 * @property {string} id        Identificador unico de la unidad
 * @property {string} name      Nombre de la pieza
 * @property {number} w         Ancho nominal (largo de la pieza)
 * @property {number} h         Alto nominal (ancho de la pieza)
 * @property {boolean} canRotate Si puede girar 90 grados
 *
 * @typedef {Object} FreeRect
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 *
 * @typedef {Object} Placement
 * @property {string} id
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {number} w   Ancho colocado (ya considerando rotacion)
 * @property {number} h   Alto colocado (ya considerando rotacion)
 * @property {boolean} rotated
 *
 * @typedef {Object} Bin
 * @property {Placement[]} placements
 * @property {number} usedArea
 */

/**
 * Divide un rectangulo libre luego de colocar una pieza, generando sub-rectangulos
 * con cortes tipo guillotina. Reserva kerf a la derecha y abajo de la pieza.
 * @param {FreeRect} free
 * @param {number} placedW
 * @param {number} placedH
 * @param {number} kerf
 * @returns {FreeRect[]}
 */
function splitFreeRect(free, placedW, placedH, kerf) {
  const leftoverW = free.w - placedW - kerf;
  const leftoverH = free.h - placedH - kerf;

  // SplitShorterLeftoverAxis: se corta por el eje con menor sobrante para
  // conservar el rectangulo mas grande posible.
  const splitHorizontal = leftoverW <= leftoverH;

  const rects = [];

  if (splitHorizontal) {
    // Rectangulo derecho: al lado de la pieza, misma altura de la pieza.
    if (leftoverW > 0) {
      rects.push({
        x: free.x + placedW + kerf,
        y: free.y,
        w: leftoverW,
        h: placedH,
      });
    }
    // Rectangulo inferior: ocupa todo el ancho del rectangulo original.
    if (leftoverH > 0) {
      rects.push({
        x: free.x,
        y: free.y + placedH + kerf,
        w: free.w,
        h: leftoverH,
      });
    }
  } else {
    // Rectangulo derecho: ocupa toda la altura del rectangulo original.
    if (leftoverW > 0) {
      rects.push({
        x: free.x + placedW + kerf,
        y: free.y,
        w: leftoverW,
        h: free.h,
      });
    }
    // Rectangulo inferior: solo debajo de la pieza, ancho de la pieza.
    if (leftoverH > 0) {
      rects.push({
        x: free.x,
        y: free.y + placedH + kerf,
        w: placedW,
        h: leftoverH,
      });
    }
  }

  return rects;
}

/**
 * Busca el mejor rectangulo libre para colocar una pieza (Best Area Fit).
 * @param {FreeRect[]} freeRects
 * @param {PieceUnit} piece
 * @returns {{rectIndex:number, w:number, h:number, rotated:boolean}|null}
 */
function findBestPlacement(freeRects, piece) {
  let best = null;
  let bestScore = Infinity;
  let bestShortSide = Infinity;

  for (let i = 0; i < freeRects.length; i++) {
    const free = freeRects[i];

    const orientations = [{ w: piece.w, h: piece.h, rotated: false }];
    if (piece.canRotate && piece.w !== piece.h) {
      orientations.push({ w: piece.h, h: piece.w, rotated: true });
    }

    for (const o of orientations) {
      if (o.w <= free.w && o.h <= free.h) {
        const areaFit = free.w * free.h - o.w * o.h;
        const shortSide = Math.min(free.w - o.w, free.h - o.h);
        // Best Area Fit, desempate por lado corto (deja restos mas utiles).
        if (
          areaFit < bestScore ||
          (areaFit === bestScore && shortSide < bestShortSide)
        ) {
          bestScore = areaFit;
          bestShortSide = shortSide;
          best = { rectIndex: i, w: o.w, h: o.h, rotated: o.rotated };
        }
      }
    }
  }

  return best;
}

/**
 * Empaqueta una lista de piezas en tantas placas como sea necesario.
 * Recorre las piezas en el orden dado; lo que no entra en la placa actual
 * pasa a la siguiente placa.
 * @param {PieceUnit[]} pieces  Unidades a colocar (una por pieza fisica)
 * @param {number} sheetW       Ancho util de la placa
 * @param {number} sheetH       Alto util de la placa
 * @param {number} kerf         Ancho de sierra
 * @returns {{bins: Bin[], unfit: PieceUnit[]}}
 */
export function packSheets(pieces, sheetW, sheetH, kerf) {
  const unfit = [];
  const placeable = [];

  for (const piece of pieces) {
    const fitsNormal = piece.w <= sheetW && piece.h <= sheetH;
    const fitsRotated =
      piece.canRotate && piece.h <= sheetW && piece.w <= sheetH;
    if (fitsNormal || fitsRotated) {
      placeable.push(piece);
    } else {
      unfit.push(piece);
    }
  }

  const bins = [];
  let remaining = placeable;

  while (remaining.length > 0) {
    const bin = { placements: [], usedArea: 0 };
    let freeRects = [{ x: 0, y: 0, w: sheetW, h: sheetH }];
    const nextRemaining = [];
    let placedAny = false;

    for (const piece of remaining) {
      const placement = findBestPlacement(freeRects, piece);
      if (!placement) {
        nextRemaining.push(piece);
        continue;
      }

      const free = freeRects[placement.rectIndex];
      bin.placements.push({
        id: piece.id,
        name: piece.name,
        x: free.x,
        y: free.y,
        w: placement.w,
        h: placement.h,
        rotated: placement.rotated,
      });
      bin.usedArea += placement.w * placement.h;
      placedAny = true;

      const newRects = splitFreeRect(free, placement.w, placement.h, kerf);
      freeRects.splice(placement.rectIndex, 1, ...newRects);
    }

    // Salvaguarda: si no se pudo colocar nada, evitamos loop infinito.
    if (!placedAny) {
      unfit.push(...remaining);
      break;
    }

    bins.push(bin);
    remaining = nextRemaining;
  }

  return { bins, unfit };
}
