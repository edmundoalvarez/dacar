//CÁLCULO TOTAL DE FILO
export const calculateTotalEdges = (modules) => {
  let totalEdgeLength = 0;
  let totalLacqueredEdgeLength = 0;
  let totalPolishedEdgeLength = 0;

  modules?.forEach((module) => {
    module.pieces.forEach((piece) => {
      if (piece.edgeLength) {
        if (!piece.lacqueredEdge && !piece.polishedEdge) {
          totalEdgeLength += piece.edgeLengthSides * piece.length * piece.qty;
        }
        if (piece.lacqueredEdge) {
          totalLacqueredEdgeLength +=
            piece.edgeLengthSides * piece.length * piece.qty;
        }
        if (piece.polishedEdge) {
          totalPolishedEdgeLength +=
            piece.edgeLengthSides * piece.length * piece.qty;
          totalEdgeLength += piece.edgeLengthSides * piece.length * piece.qty;
        }
      }
      if (piece.edgeWidth) {
        if (!piece.lacqueredEdge && !piece.polishedEdge) {
          totalEdgeLength += piece.edgeWidthSides * piece.width * piece.qty;
        }

        if (piece.lacqueredEdge) {
          totalLacqueredEdgeLength +=
            piece.edgeWidthSides * piece.width * piece.qty;
        }
        if (piece.polishedEdge) {
          totalPolishedEdgeLength +=
            piece.edgeWidthSides * piece.width * piece.qty;
          totalEdgeLength += piece.edgeWidthSides * piece.width * piece.qty;
        }
      }
    });
  });

  return {
    totalEdgeLength,
    totalLacqueredEdgeLength,
    totalPolishedEdgeLength,
  };
};
