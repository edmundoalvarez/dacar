function ViewModulesFurniture({ sortedModules }) {
    return (
        <div className="p-4 text-black">
            <h2 className="text-3xl font-semibold mb-8 uppercase">
                Despiece por módulo
            </h2>
            {sortedModules?.map((module) => (
                <div
                    key={module._id}
                    className="mb-8 p-4 bg-white rounded-md shadow-md border-2 border-emerald-600"
                >
                    <h3 className="text-2xl font-bold mb-2 bg-emerald-600 text-white px-3 py-2 rounded">
                        {module.name}
                    </h3>
                    {/* container datos  modulo e insumos */}
                    <div className="flex gap-10">
                        <div className="w-2/4">
                            <h4 className="text-lg font-semibold border-2 border-emerald-600 px-3 py-1 text-emerald-600 rounded">
                                Descripción módulo
                            </h4>
                            <div className="p-3">
                                <p className="mb-1">
                                    <span className="font-bold">Material:</span>{" "}
                                    {module.material}
                                </p>
                                <p className="mb-1">
                                    <span className="font-bold">Alto:</span>{" "}
                                    {module.height}
                                </p>
                                <p className="mb-1">
                                    <span className="font-bold">Largo:</span>{" "}
                                    {module.length}
                                </p>
                                <p className="mb-1">
                                    <span className="font-bold">
                                        Profundidad:
                                    </span>{" "}
                                    {module.width}
                                </p>
                                <p className="mb-1">
                                    <span className="font-bold">
                                        Descripción:
                                    </span>{" "}
                                    {module.description}
                                </p>
                                <p className="mb-1">
                                    <span className="font-bold">
                                        Cantidad de piezas:
                                    </span>{" "}
                                    {module.pieces_number}
                                </p>
                            </div>
                        </div>
                        <div className="w-2/4">
                            <h4 className="text-lg font-semibold border-2 border-emerald-600 px-3 py-1 text-emerald-600 rounded">
                                Insumos módulo
                            </h4>
                            <div className="p-3">
                                {module.supplies_module.map((supply, index) => (
                                    <div key={index} className="mb-2">
                                        <p>
                                            <span className="font-bold">
                                                Nombre:
                                            </span>{" "}
                                            {supply.supplie_name}
                                        </p>
                                        <p>
                                            <span className="font-bold">
                                                Cantidad:
                                            </span>{" "}
                                            {supply.supplie_qty}
                                        </p>
                                        {/* <p>
                                          <span className="font-bold">Largo:</span>{" "}
                                            {supply.supplie_length}
                                          </p> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-xl lt-rounded rounded-tr rounded-tl font-semibold bg-emerald-600 m-0 px-3 py-1 text-white">
                            Piezas
                        </h4>
                        <div className="overflow-x-auto rounded-br rounded-bl shadow-sm  bg-white">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Cant.
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Material
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Comentario
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Largo
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Alto
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Orientación
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Acabado
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Filo Largo
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Filo Alto
                                        </th>
                                        <th className="align-middle items-center px-4 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                                            Tipo de Filo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {module.pieces
                                        .sort((a, b) =>
                                            a.material.localeCompare(b.material)
                                        )
                                        .map((piece, index) => (
                                            <tr
                                                key={piece._id}
                                                className="border-t border-r border-l"
                                            >
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.name}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.qty}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.material}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.comment}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.orientation ===
                                                    "cross-horizontal"
                                                        ? piece.length
                                                        : piece.width}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {/* {piece.length} */}
                                                    {piece.orientation ===
                                                    "cross-horizontal"
                                                        ? piece.width
                                                        : piece.length}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.orientation ===
                                                    "cross-vertical"
                                                        ? "Transversal Vertical"
                                                        : piece.orientation ===
                                                          "cross-horizontal"
                                                        ? "Transversal Horizontal"
                                                        : piece.orientation ===
                                                          "side"
                                                        ? "Lateral"
                                                        : ""}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.lacqueredPiece ? (
                                                        <>
                                                            Laqueado
                                                            <br />
                                                            {piece.lacqueredPieceSides ===
                                                                1 && (
                                                                <strong>
                                                                    1 lado
                                                                </strong>
                                                            )}
                                                            {piece.lacqueredPieceSides ===
                                                                2 && (
                                                                <strong>
                                                                    2 lados
                                                                </strong>
                                                            )}
                                                            {""}
                                                            <br></br>
                                                            {piece.pantographed ? (
                                                                <strong>
                                                                    Pantografiado
                                                                </strong>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </>
                                                    ) : piece.veneer ? (
                                                        <>
                                                            Enchapado Artesanal
                                                            <br></br>
                                                            {piece.veneerFinishing &&
                                                            piece.veneerFinishing ===
                                                                "veneerLacquered" &&
                                                            piece.veneerLacqueredPieceSides ===
                                                                1 ? (
                                                                <strong>
                                                                    Laqueado
                                                                    Poro abierto{" "}
                                                                    <br></br> 1
                                                                    lado
                                                                </strong>
                                                            ) : piece.veneerFinishing &&
                                                              piece.veneerFinishing ===
                                                                  "veneerLacquered" &&
                                                              piece.veneerLacqueredPieceSides ===
                                                                  2 ? (
                                                                <strong>
                                                                    Laqueado
                                                                    Poro abierto{" "}
                                                                    <br></br> 2
                                                                    lados
                                                                </strong>
                                                            ) : piece.veneerFinishing &&
                                                              piece.veneerFinishing ===
                                                                  "veneerPolished" ? (
                                                                <strong>
                                                                    Lustrado
                                                                </strong>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </>
                                                    ) : piece.veneer2 ? (
                                                        <>
                                                            Enchapado No
                                                            Artesanal
                                                            <br></br>
                                                            {piece.veneer2Finishing &&
                                                            piece.veneer2Finishing ===
                                                                "veneer2Lacquered" &&
                                                            piece.veneer2LacqueredPieceSides ===
                                                                1 ? (
                                                                <strong>
                                                                    Laqueado
                                                                    Poro abierto
                                                                    <br></br>1
                                                                    lado
                                                                </strong>
                                                            ) : piece.veneer2Finishing &&
                                                              piece.veneer2Finishing ===
                                                                  "veneer2Lacquered" &&
                                                              piece.veneer2LacqueredPieceSides ===
                                                                  2 ? (
                                                                <strong>
                                                                    Laqueado
                                                                    Poro abierto
                                                                    <br></br> 2
                                                                    lados
                                                                </strong>
                                                            ) : piece.veneer2Finishing &&
                                                              piece.veneer2Finishing ===
                                                                  "veneer2Polished" ? (
                                                                <strong>
                                                                    Lustrado
                                                                </strong>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </>
                                                    ) : piece.melamine ? (
                                                        <>
                                                            Melamina
                                                            <br />
                                                            {piece.melamineLacquered ? (
                                                                <strong>
                                                                    Laqueada
                                                                </strong>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <br />
                                                            {piece.melamineLacqueredPieceSides ===
                                                                1 && (
                                                                <strong>
                                                                    1 lado
                                                                </strong>
                                                            )}
                                                            {piece.melamineLacqueredPieceSides ===
                                                                2 && (
                                                                <strong>
                                                                    2 lados
                                                                </strong>
                                                            )}{" "}
                                                        </>
                                                    ) : (
                                                        "No indica"
                                                    )}
                                                </td>
                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.orientation ===
                                                    "cross-horizontal"
                                                        ? piece.edgeLength
                                                            ? `Sí, ${
                                                                  piece.edgeLengthSides ===
                                                                  1
                                                                      ? "un lado"
                                                                      : piece.edgeLengthSides ===
                                                                        2
                                                                      ? "dos lados"
                                                                      : "falta cantidad lados"
                                                              }`
                                                            : "No"
                                                        : piece.edgeWidth
                                                        ? `Sí, ${
                                                              piece.edgeWidthSides ===
                                                              1
                                                                  ? "un lado"
                                                                  : piece.edgeWidthSides ===
                                                                    2
                                                                  ? "dos lados"
                                                                  : "falta cantidad lados"
                                                          }`
                                                        : "No"}
                                                </td>

                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
                                                    {piece.orientation ===
                                                    "cross-horizontal"
                                                        ? piece.edgeWidth
                                                            ? `Sí, ${
                                                                  piece.edgeWidthSides ===
                                                                  1
                                                                      ? "un lado"
                                                                      : piece.edgeWidthSides ===
                                                                        2
                                                                      ? "dos lados"
                                                                      : "falta cantidad lados"
                                                              }`
                                                            : "No"
                                                        : piece.edgeLength
                                                        ? `Sí, ${
                                                              piece.edgeLengthSides ===
                                                              1
                                                                  ? "un lado"
                                                                  : piece.edgeLengthSides ===
                                                                    2
                                                                  ? "dos lados"
                                                                  : "falta cantidad lados"
                                                          }`
                                                        : "No"}
                                                </td>

                                                <td className="align-middle items-center px-4 py-2 text-center border-b">
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
                </div>
            ))}
        </div>
    );
}
export { ViewModulesFurniture };
