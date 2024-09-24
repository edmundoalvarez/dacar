//CÁLCULO DE TOTAL PIEZAS ENCHAPADAS EN METROS CUADRADOS
export const calculateTotalVeneer = (modules) => {
  let totalVeneer = 0;
  let totalVeneer2 = 0;
  let totalVeneerPolished = 0;
  let totalVeneerLacqueredOpen = 0;

  modules?.forEach((module) => {
    module.pieces.forEach((piece) => {
      //ENCHAPADO ARTESANAL
      if (piece.veneer) {
        totalVeneer += piece.length * piece.width * piece.qty; //se suma el enchapado artesanal total
        if (piece.veneerFinishing === "veneerLacquered") {
          totalVeneerLacqueredOpen +=
            piece.length *
            piece.width *
            piece.qty *
            piece.veneerLacqueredPieceSides;
        }
        if (piece.veneerFinishing === "veneerPolished") {
          totalVeneerPolished += piece.length * piece.width * piece.qty * 2;
        }
      }
      //ENCHAPADO NO ARTESANAL

      if (piece.veneer2) {
        totalVeneer2 += piece.length * piece.width * 1.2 * piece.qty; //se suma el enchapado artesanal total
        if (piece.veneer2Finishing === "veneerLacquered") {
          totalVeneerLacqueredOpen +=
            piece.length *
            piece.width *
            piece.qty *
            piece.veneerLacqueredPieceSides;
        }
        if (piece.veneer2Finishing === "veneer2Polished") {
          totalVeneerPolished += piece.length * piece.width * piece.qty * 2;
        }
      }
    });
  });

  return {
    totalVeneer,
    totalVeneer2,
    totalVeneerPolished,
    totalVeneerLacqueredOpen,
  };
};
