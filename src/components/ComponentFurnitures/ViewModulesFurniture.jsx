function ViewModulesFurniture({ sortedModules }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2">Despiece por módulo</h2>
      {sortedModules?.map((module) => (
        <div
          key={module._id}
          className="mb-8 p-4 bg-white rounded-md shadow-md"
        >
          <h3 className="text-xl font-bold mb-2">{module.name}</h3>
          {/* container datos  modulo e insumos */}
          <div className="flex gap-28">
            <div>
              <h4 className="text-xl font-semibold">Descripción módulo:</h4>
              <p className="mb-1">
                <span className="font-bold">Categoría:</span> {module.category}
              </p>
              <p className="mb-1">
                <span className="font-bold">Alto:</span> {module.height}
              </p>
              <p className="mb-1">
                <span className="font-bold">Largo:</span> {module.length}
              </p>
              <p className="mb-1">
                <span className="font-bold">Profundidad:</span> {module.width}
              </p>
              <p className="mb-1">
                <span className="font-bold">Cantidad de piezas:</span>{" "}
                {module.pieces_number}
              </p>
            </div>
            <div className="">
              <h4 className="text-xl font-semibold">Insumos módulo:</h4>
              <div className="flex flex-wrap">
                {module.supplies_module.map((supply, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <span className="font-bold">Nombre:</span>{" "}
                      {supply.supplie_name}
                    </p>
                    <p>
                      <span className="font-bold">Cantidad:</span>{" "}
                      {supply.supplie_qty}
                    </p>
                    <p>
                      <span className="font-bold">Largo:</span>{" "}
                      {supply.supplie_length}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Piezas:</h4>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Nombre</th>
                  <th className="px-4 py-2 border-b">Material</th>
                  <th className="px-4 py-2 border-b">Categoría</th>
                  <th className="px-4 py-2 border-b">Alto</th>
                  <th className="px-4 py-2 border-b">Largo</th>
                  <th className="px-4 py-2 border-b">Orientación</th>
                  <th className="px-4 py-2 border-b">Acabado</th>
                  <th className="px-4 py-2 border-b">Filo Alto</th>
                  <th className="px-4 py-2 border-b">Filo Largo</th>
                  <th className="px-4 py-2 border-b">Filo Laqueado</th>
                </tr>
              </thead>
              <tbody>
                {module.pieces
                  .sort((a, b) => a.material.localeCompare(b.material))
                  .map((piece, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border-b">{piece.name}</td>
                      <td className="px-4 py-2 border-b">{piece.material}</td>
                      <td className="px-4 py-2 border-b">{piece.category}</td>
                      <td className="px-4 py-2 border-b">{piece.length}</td>
                      <td className="px-4 py-2 border-b">{piece.width}</td>
                      <td className="px-4 py-2 border-b">
                        {piece.orientation === "cross-vertical"
                          ? "Transversal Vertical"
                          : piece.orientation === "cross-horizontal"
                          ? "Transversal Horizontal"
                          : piece.orientation === "side"
                          ? "Lateral"
                          : ""}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {piece.lacqueredPiece ? (
                          <>
                            Laqueado
                            {piece.lacqueredPieceSides === "single" &&
                              " (1 lado)"}
                            {piece.lacqueredPieceSides === "double" &&
                              " (2 lados)"}{" "}
                            <br></br>
                            {piece.pantographed ? "Pantografiado" : ""}
                          </>
                        ) : piece.veneer ? (
                          <>
                            Enchapado<br></br>
                            {piece.veneerFinishing &&
                            piece.veneerFinishing === "veneerLacquered"
                              ? "(Laqueado)"
                              : piece.veneerFinishing &&
                                piece.veneerFinishing === "veneerPolished"
                              ? "(Lustrado)"
                              : ""}
                          </>
                        ) : piece.melamine ? (
                          <>
                            Melamina
                            <br />
                            {piece.melamineLacquered ? "Laqueada" : ""}
                          </>
                        ) : (
                          "No indica"
                        )}
                      </td>

                      <td className="px-4 py-2 border-b">
                        {piece.edgeLength
                          ? `Sí, ${
                              piece.edgeLengthSides === "1"
                                ? "un lado"
                                : piece.edgeLengthSides === "2"
                                ? "dos lados"
                                : "falta cantidad lados"
                            }`
                          : "No"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {piece.edgeWidth
                          ? `Sí, ${
                              piece.edgeWidthSides === "1"
                                ? "un lado"
                                : piece.edgeWidthSides === "2"
                                ? "dos lados"
                                : "falta cantidad lados"
                            }`
                          : "No"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {piece.lacqueredEdge ? "Sí" : "No"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
export { ViewModulesFurniture };
