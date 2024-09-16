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
                <span className="font-bold">Material:</span> {module.material}
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
              <div className="flex flex-wrap gap-4">
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
                  <th className="px-2 py-2 border-b">Cant.</th>
                  <th className="px-4 py-2 border-b">Material</th>
                  <th className="px-4 py-2 border-b">Comentario</th>
                  <th className="px-2 py-2 border-b">Largo</th>
                  <th className="px-2 py-2 border-b">Alto</th>
                  <th className="px-4 py-2 border-b">Orientación</th>
                  <th className="px-4 py-2 border-b">Acabado</th>
                  <th className="px-4 py-2 border-b">Filo Largo</th>
                  <th className="px-4 py-2 border-b">Filo Alto</th>
                  <th className="px-4 py-2 border-b">Tipo de Filo</th>
                </tr>
              </thead>
              <tbody>
                {module.pieces
                  .sort((a, b) => a.material.localeCompare(b.material))
                  .map((piece, index) => (
                    <tr key={piece._id} className="border-t">
                      <td className="px-4 py-2 text-center border-b">
                        {piece.name}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.qty}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.material}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.comment}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.orientation === "cross-horizontal"
                          ? piece.length
                          : piece.width}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {/* {piece.length} */}
                        {piece.orientation === "cross-horizontal"
                          ? piece.width
                          : piece.length}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.orientation === "cross-vertical"
                          ? "Transversal Vertical"
                          : piece.orientation === "cross-horizontal"
                          ? "Transversal Horizontal"
                          : piece.orientation === "side"
                          ? "Lateral"
                          : ""}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
                        {piece.lacqueredPiece ? (
                          <>
                            Laqueado
                            <br />
                            {piece.lacqueredPieceSides === "single" && (
                              <strong>1 lado</strong>
                            )}
                            {piece.lacqueredPieceSides === "double" && (
                              <strong>2 lados</strong>
                            )}{" "}
                            <br></br>
                            {piece.pantographed ? (
                              <strong>Pantografiado</strong>
                            ) : (
                              ""
                            )}
                          </>
                        ) : piece.veneer ? (
                          <>
                            Enchapado Artesanal<br></br>
                            {piece.veneerFinishing &&
                            piece.veneerFinishing === "veneerLacquered" &&
                            piece.veneerLacqueredPieceSides === "single" ? (
                              <strong>Laqueado 1 lado</strong>
                            ) : piece.veneerFinishing &&
                              piece.veneerFinishing === "veneerLacquered" &&
                              piece.veneerLacqueredPieceSides === "double" ? (
                              <strong>Laqueado 2 lados</strong>
                            ) : piece.veneerFinishing &&
                              piece.veneerFinishing === "veneerPolished" ? (
                              <strong>Lustrado</strong>
                            ) : (
                              ""
                            )}
                            <br />
                            {piece.veneerLacqueredOpen ? (
                              <strong>Poro abierto</strong>
                            ) : (
                              ""
                            )}
                          </>
                        ) : piece.veneer2 ? (
                          <>
                            Enchapado No Artesanal<br></br>
                            {piece.veneer2Finishing &&
                            piece.veneer2Finishing === "veneer2Lacquered" &&
                            piece.veneer2LacqueredPieceSides === "single" ? (
                              <strong>Laqueado 1 lado</strong>
                            ) : piece.veneer2Finishing &&
                              piece.veneer2Finishing === "veneer2Lacquered" &&
                              piece.veneer2LacqueredPieceSides === "double" ? (
                              <strong>Laqueado 2 lados</strong>
                            ) : piece.veneer2Finishing &&
                              piece.veneer2Finishing === "veneer2Polished" ? (
                              <strong>Lustrado</strong>
                            ) : (
                              ""
                            )}
                            <br />
                            {piece.veneer2LacqueredOpen ? (
                              <strong>Poro abierto</strong>
                            ) : (
                              ""
                            )}
                          </>
                        ) : piece.melamine ? (
                          <>
                            Melamina
                            <br />
                            {piece.melamineLacquered ? (
                              <strong>Laqueada</strong>
                            ) : (
                              ""
                            )}
                            <br />
                            {piece.melamineLacqueredPieceSides === 1 && (
                              <strong> 1 lado</strong>
                            )}
                            {piece.melamineLacqueredPieceSides === 2 && (
                              <strong>2 lados</strong>
                            )}{" "}
                          </>
                        ) : (
                          "No indica"
                        )}
                      </td>
                      <td className="px-4 py-2 text-center border-b">
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

                      <td className="px-4 py-2 text-center border-b">
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

                      <td className="px-4 py-2 text-center border-b">
                        {piece.lacqueredEdge
                          ? "Laqueado"
                          : piece.polishedEdge
                          ? "Lustrado"
                          : ""}
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
