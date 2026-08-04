// Metaheuristica (Simulated Annealing) sobre el orden de las piezas.
// La rotacion se resuelve de forma golosa dentro del colocador guillotina,
// asi que aca solo optimizamos la permutacion de piezas.

import { packSheets } from "./guillotine.js";

/**
 * Generador pseudoaleatorio determinista (mulberry32) para resultados
 * reproducibles ante los mismos datos de entrada.
 * @param {number} seed
 */
function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Funcion objetivo: menos placas es siempre mejor. Ante igual cantidad de
 * placas, preferimos que la placa menos llena quede lo mas vacia posible
 * (candidata a eliminarse), lo que da un gradiente util al SA.
 * @param {{bins: import("./guillotine.js").Bin[]}} packed
 * @param {number} sheetArea
 * @returns {number}
 */
function evaluate(packed, sheetArea) {
  const bins = packed.bins;
  if (bins.length === 0) return 0;
  let leastFilled = Infinity;
  for (const bin of bins) {
    if (bin.usedArea < leastFilled) leastFilled = bin.usedArea;
  }
  return bins.length - 1 + leastFilled / sheetArea;
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Optimiza la disposicion de piezas en placas minimizando el desperdicio.
 * @param {import("./guillotine.js").PieceUnit[]} pieces
 * @param {number} sheetW
 * @param {number} sheetH
 * @param {number} kerf
 * @param {Object} [options]
 * @param {number} [options.iterations=3000]
 * @param {number} [options.startTemp=1]
 * @param {number} [options.endTemp=0.001]
 * @param {number} [options.seed=12345]
 * @returns {{bins: import("./guillotine.js").Bin[], unfit: import("./guillotine.js").PieceUnit[]}}
 */
export function optimize(pieces, sheetW, sheetH, kerf, options = {}) {
  const {
    iterations = 3000,
    startTemp = 1,
    endTemp = 0.001,
    seed = 12345,
  } = options;

  const sheetArea = sheetW * sheetH;
  const rng = createRng(seed);

  // Orden inicial: por area descendente (buena heuristica de arranque).
  let current = pieces
    .slice()
    .sort((a, b) => b.w * b.h - a.w * a.h);

  let currentPacked = packSheets(current, sheetW, sheetH, kerf);
  let currentCost = evaluate(currentPacked, sheetArea);

  let best = current;
  let bestPacked = currentPacked;
  let bestCost = currentCost;

  // Con pocas piezas no vale la pena iterar mucho.
  if (pieces.length < 3 || iterations <= 0) {
    return { bins: bestPacked.bins, unfit: bestPacked.unfit };
  }

  const cooling = Math.pow(endTemp / startTemp, 1 / iterations);
  let temp = startTemp;

  for (let iter = 0; iter < iterations; iter++) {
    // Vecino: swap de dos posiciones o mover una pieza al frente.
    const candidate = current.slice();
    const i = Math.floor(rng() * candidate.length);
    let j = Math.floor(rng() * candidate.length);
    if (i === j) j = (j + 1) % candidate.length;

    if (rng() < 0.5) {
      [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
    } else {
      const [moved] = candidate.splice(i, 1);
      candidate.splice(j, 0, moved);
    }

    const candidatePacked = packSheets(candidate, sheetW, sheetH, kerf);
    const candidateCost = evaluate(candidatePacked, sheetArea);

    const delta = candidateCost - currentCost;
    if (delta < 0 || rng() < Math.exp(-delta / temp)) {
      current = candidate;
      currentPacked = candidatePacked;
      currentCost = candidateCost;

      if (candidateCost < bestCost) {
        best = candidate;
        bestPacked = candidatePacked;
        bestCost = candidateCost;
      }
    }

    temp *= cooling;
  }

  // Reintento con un par de arranques aleatorios por si el SA quedo atrapado.
  const restarts = Math.min(2, Math.floor(iterations / 1000));
  for (let r = 0; r < restarts; r++) {
    const shuffled = shuffle(pieces, rng);
    const packed = packSheets(shuffled, sheetW, sheetH, kerf);
    const cost = evaluate(packed, sheetArea);
    if (cost < bestCost) {
      best = shuffled;
      bestPacked = packed;
      bestCost = cost;
    }
  }

  void best;
  return { bins: bestPacked.bins, unfit: bestPacked.unfit };
}
