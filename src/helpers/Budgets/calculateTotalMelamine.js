//CÁLCULO DE TOTAL PIEZAS MELAMINA EN METROS CUADRADOS
export const calculateTotalMelamine = (modules) => {
  let totalMelamine = 0;
  let totalMelamineLacquered = 0;

  modules?.forEach((module) => {
    module.pieces.forEach((piece) => {
      if (piece.melamine) {
        if (piece.melamineLacquered) {
          totalMelamineLacquered +=
            piece.length *
            piece.width *
            piece.qty *
            piece.melamineLacqueredPieceSides;
        } else {
          totalMelamine += piece.length * piece.width * 2 * piece.qty;
        }
      }
    });
  });

  return {
    totalMelamine,
    totalMelamineLacquered,
  };
};
