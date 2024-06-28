import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFurnitures } from "../../index.js";

function Furniture() {
  const [furnitures, setFurnitures] = useState([]);

  const getAllFurnituresToSet = () => {
    getAllFurnitures()
      .then((furnituresData) => {
        setFurnitures(furnituresData.data);
        console.log('furnitureData (line 11); ', furnituresData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getAllFurnituresToSet();
  }, []);

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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(furniture.modules_furniture) ? (
                      furniture.modules_furniture.map((module, index) => (
                        <div key={index}>
                          <p>{module.name}</p>
                        </div>
                      ))
                    ) : (
                      <p>No modules available</p>
                    )}
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

export { Furniture };
