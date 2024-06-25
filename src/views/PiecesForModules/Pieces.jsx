import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPieces } from "../../index.js";
import { getModuleById } from "../../index.js";

function Pieces() {
  const { id } = useParams();
  const [pieces, setPieces] = useState([]);
  const [module, setModule] = useState([]);

  const getAllPiecesToSet = () => {
    getAllPieces()
      .then((piecesData) => {
        //! Por qué aca tengo que hacer data.module?
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
          <h1 className="text-4xl">Piézas del módulo: {module.name}</h1>
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
                  Largo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Ancho
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
                  Filo
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
                    {piece.edge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export { Pieces };
