import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPieces, deletePiece, getModuleById } from "../../index.js";

function Pieces() {
  const { id } = useParams();
  const [pieces, setPieces] = useState([]);
  const [module, setModule] = useState([]);

  const getAllPiecesToSet = () => {
    getAllPieces()
      .then((piecesData) => {
        // console.log(piecesData);
        const filteredPieces = piecesData.data.filter(
          (piece) => piece.module_id === id
        );
        setPieces(filteredPieces);
        console.log(filteredPieces);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getModuleToSet = () => {
    getModuleById(id)
      .then((moduleData) => {
        setModule(moduleData.data);
        console.log(moduleData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Eliminar pieza
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState(null);

  function handleDeletePiece(pieceId) {
    setOpenModalToDelete(true);
    setPieceToDelete(pieceId);
  }
  function deleteSinglePiece(pieceId) {
    deletePiece(pieceId)
      .then((res) => {
        getAllPiecesToSet();
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setPieceToDelete(null);
  }

  //traer las placas
  useEffect(() => {
    getAllPiecesToSet();
  }, []);

  useEffect(() => {
    getModuleToSet();
  }, []);

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4">
          <h1 className="text-4xl">Piezas del módulo: {module.name}</h1>
          <Link
            to="/ver-modulos"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver a los Módulos
          </Link>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Largo
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Material
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Acabado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Filo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Accion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pieces.map((piece) => (
                <tr key={piece.name} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.width}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p>
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
                            ? "Laqueado"
                            : piece.veneerFinishing &&
                              piece.veneerFinishing === "veneerPolished"
                            ? "Lustrado"
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
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.edge && piece.edge.edgeLength ? (
                      <p>
                        {piece.edge.edgeLength} cm{" "}
                        {piece.edge.lacqueredEdge ? "(Laqueado)" : ""}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex justify-center items-center gap-x-4">
                      <Link
                        to={`
                        `}
                        className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                      >
                        Editar
                      </Link>
                      <button
                        className="text-white bg-red-500 rounded-md px-2 py-1 mb-2"
                        onClick={() => handleDeletePiece(piece._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar la pieza?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSinglePiece(pieceToDelete)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => setOpenModalToDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Pieces };
