//CÁLCULO DE TOTAL PIEZAS ENCHAPADAS EN METROS CUADRADOS
export const calculateTotalVeneer = (modules) => {
  let totalVeneerPolished = 0;
  let totalVeneerLacquered = 0;
  let totalVeneerLacqueredOpen = 0;
  let totalVeneer = 0;
  let totalVeneer2Polished = 0;
  let totalVeneer2Lacquered = 0;
  let totalVeneer2LacqueredOpen = 0;
  let totalVeneer2 = 0;
  let totalVeneerLacqueredOpenTotal = 0;
  let totalVeneerPolishedTotal = 0;
  modules?.forEach((module) => {
    module.pieces.forEach((piece) => {
      //ENCHAPADO ARTESANAL
      if (piece.veneer) {
        totalVeneer += piece.length * piece.width * 1.2 * piece.qty; //se suma el enchapado artesanal total
        if (piece.veneerFinishing === "veneerLacquered") {
          //laqueado poro abierto 1 lado
          if (
            piece.veneerLacqueredPieceSides === "single" &&
            piece.veneerLacqueredOpen
          ) {
            totalVeneerLacqueredOpen += piece.length * piece.width * piece.qty;
          }
          //laqueado comun 1 lado
          if (
            piece.veneerLacqueredPieceSides === "single" &&
            !piece.veneerLacqueredOpen
          ) {
            totalVeneerLacquered += piece.length * piece.width * piece.qty;
          }
          //laqueado poro abierto 2 lados
          if (
            piece.veneerLacqueredPieceSides === "double" &&
            piece.veneerLacqueredOpen
          ) {
            totalVeneerLacqueredOpen +=
              piece.length * piece.width * piece.qty * 2;
          }
          //laqueado comun 2 lados
          if (
            piece.veneerLacqueredPieceSides === "double" &&
            !piece.veneerLacqueredOpen
          ) {
            totalVeneerLacquered += piece.length * piece.width * piece.qty * 2;
          }
        }
        if (piece.veneerFinishing === "veneerPolished") {
          totalVeneerPolished += piece.length * piece.width * piece.qty * 2;
        }
      }
      //ENCHAPADO NO ARTESANAL

      if (piece.veneer2) {
        totalVeneer2 += piece.length * piece.width * 1.2 * piece.qty; //se suma el enchapado artesanal total
        if (piece.veneer2Finishing === "veneerLacquered") {
          //laqueado poro abierto 1 lado
          if (
            piece.veneer2LacqueredPieceSides === "single" &&
            piece.veneer2LacqueredOpen
          ) {
            totalVeneer2LacqueredOpen += piece.length * piece.width * piece.qty;
          }
          //laqueado comun 1 lado
          if (
            piece.veneer2LacqueredPieceSides === "single" &&
            !piece.veneer2LacqueredOpen
          ) {
            totalVeneer2Lacquered += piece.length * piece.width * piece.qty;
          }
          //laqueado poro abierto 2 lados
          if (
            piece.veneer2LacqueredPieceSides === "double" &&
            piece.veneer2LacqueredOpen
          ) {
            totalVeneer2LacqueredOpen +=
              piece.length * piece.width * piece.qty * 2;
          }
          //laqueado comun 2 lados
          if (
            piece.veneer2LacqueredPieceSides === "double" &&
            !piece.veneer2LacqueredOpen
          ) {
            totalVeneer2Lacquered += piece.length * piece.width * piece.qty * 2;
          }
        }
        if (piece.veneer2Finishing === "veneerPolished") {
          totalVeneer2Polished += piece.length * piece.width * piece.qty * 2;
        }
      }
    });
    //total laqueado
    totalVeneerLacqueredOpenTotal =
      totalVeneerLacqueredOpen + totalVeneer2LacqueredOpen;
    //total lustrado
    totalVeneerPolishedTotal = totalVeneerPolished + totalVeneer2Polished;
  });

  return {
    totalVeneer,
    totalVeneerPolished,
    totalVeneerLacquered,
    totalVeneerLacqueredOpen,
    totalVeneer2,
    totalVeneer2Polished,
    totalVeneer2Lacquered,
    totalVeneer2LacqueredOpen,
    totalVeneerLacqueredOpenTotal,
    totalVeneerPolishedTotal,
  };
};
