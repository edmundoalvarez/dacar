import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFurnitures } from "../../index.js";

function Furniture() {
  const [furnitures, setFurnitures] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllFurnituresToSet = () => {
    getAllFurnitures()
      .then((furnituresData) => {
        setFurnitures(furnituresData.data);
        console.log("furnitureData (line 11); ", furnituresData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getAllFurnituresToSet();
  }, []);

  //Manejo de la ventana modal
  const handleOpenModal = (module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4">
          <h1 className="text-4xl">Muebles</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-mueble"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Mueble
          </Link>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Largo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Ancho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Módulos
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {furnitures.map((furniture) => (
                <tr key={furniture._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.width}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col gap-4">
                    {Array.isArray(furniture.modules_furniture) ? (
                      furniture.modules_furniture.map((module, index) => (
                        <>
                          <div key={index} className="flex items-center">
                            <p className="w-[140px]">{module.name}</p>
                            <button
                              onClick={() => handleOpenModal(module)}
                              className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                            >
                              Ver
                            </button>
                          </div>
                          {index % 2 === 0 ? <hr /> : ""}
                        </>
                      ))
                    ) : (
                      <p>Sin Módulos</p>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="text-white bg-orange rounded-md  px-2 py-1 mb-2">
                        Editar
                      </button>
                      <button className="text-white bg-lightblue rounded-md  px-2 py-1 mb-2">
                        Presupuestar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Abrimos la modal en caso que el estado isModalOpen cambie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-screen overflow-y-auto">
            <h2 className="text-xl mb-4">
              <b>Detalles del Módulo</b>
            </h2>
            {selectedModule && (
              <div className="mb-2">
                <p>
                  <strong>Nombre:</strong> {selectedModule.name}
                </p>
                <p>
                  <strong>Largo:</strong> {selectedModule.length}
                </p>
                <p>
                  <strong>Ancho:</strong> {selectedModule.width}
                </p>
                <p>
                  <strong>Alto:</strong> {selectedModule.height}
                </p>
                <p>
                  <strong>Categoría:</strong> {selectedModule.category}
                </p>
                <h2 className="text-xl bg-blue-500 text-white w-fit px-2 my-2 rounded-lg">
                  Piezas del modulo
                </h2>
                <ul>
                  {selectedModule.pieces.map((piece) => (
                    <div key={piece._id}>
                      <li className="my-2">
                        <p>
                          <strong>Nombre:</strong> {piece.name}
                        </p>
                        <p>
                          <strong>Largo:</strong> {piece.length}
                        </p>
                        <p>
                          <strong>Ancho:</strong> {piece.width}
                        </p>
                        <p>
                          <strong>Categoría:</strong> {piece.category}
                        </p>
                        <p>
                          <strong>Categoría:</strong> {piece.material}
                        </p>
                        <p>
                          <strong>Acabado:</strong>{" "}
                          {piece.lacqueredPiece ? (
                            <>
                              Laqueado
                              {piece.lacqueredPieceSides === "single" &&
                                " (1 lado)"}
                              {piece.lacqueredPieceSides === "double" &&
                                " (2 lados)"}{" "}
                              <br />
                              {piece.pantographed ? "Pantografiado" : ""}
                            </>
                          ) : piece.veneer ? (
                            <>
                              Enchapado
                              <br />
                              {piece.veneerFinishing &&
                                (piece.veneerFinishing === "veneerLacquered"
                                  ? "Laqueado"
                                  : piece.veneerFinishing === "veneerPolished"
                                  ? "Lustrado"
                                  : "")}
                            </>
                          ) : piece.melamine ? (
                            <>
                              "Melamina"
                              <br />
                              {piece.melamineLacquered ? "Laqueada" : ""}
                            </>
                          ) : (
                            "No indica"
                          )}
                        </p>
                        <p>
                          <strong>Filo:</strong>{" "}
                          {piece.edge && piece.edge.edgeLength ? (
                            <span>
                              {piece.edge.edgeLength} cm{" "}
                              {piece.edge.lacqueredEdge ? "(Laqueado)" : ""}
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                      </li>
                      <button className="text-white bg-orange rounded-md  px-2 mb-2">
                        Editar
                      </button>
                      <hr className="border border-gray-400" />
                    </div>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-center items-center m-auto">
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Furniture };
