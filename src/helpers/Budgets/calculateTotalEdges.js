//CÁLCULO TOTAL DE FILO
export const calculateTotalEdges = (modules) => {
  let totalEdgeLength = 0;
  let totalLacqueredEdgeLength = 0;
  let totalPolishedEdgeLength = 0;

  modules?.forEach((module) => {
    module.pieces.forEach((piece) => {
      let pieceLength;
      let pieceWidth;
      if (piece.orientation === "cross-horizontal") {
        pieceLength = piece.width;
        pieceWidth = piece.length;
      } else {
        pieceLength = piece.length;
        pieceWidth = piece.width;
      }
      if (piece.edgeLength) {
        totalEdgeLength += piece.edgeLengthSides * pieceLength * piece.qty;
        if (piece.lacqueredEdge) {
          totalLacqueredEdgeLength +=
            piece.edgeLengthSides * pieceLength * piece.qty;
        }
        if (piece.polishedEdge && !piece.lacqueredEdge) {
          totalPolishedEdgeLength +=
            piece.edgeLengthSides * pieceLength * piece.qty;
        }
      }
      if (piece.edgeWidth) {
        totalEdgeLength += piece.edgeWidthSides * pieceWidth * piece.qty;
        if (piece.lacqueredEdge) {
          totalLacqueredEdgeLength +=
            piece.edgeWidthSides * pieceWidth * piece.qty;
        }
        if (piece.polishedEdge && !piece.lacqueredEdge) {
          totalPolishedEdgeLength +=
            piece.edgeWidthSides * pieceWidth * piece.qty;
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
