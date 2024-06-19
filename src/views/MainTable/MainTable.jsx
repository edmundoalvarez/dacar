import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTables } from "../../index.js";
function MainTable() {
  const [tables, setTables] = useState([]);

  const getAllTablesToSet = () => {
    getAllTables()
      .then((tablesData) => {
        setTables(tablesData.data.table);
        console.log(tablesData.data.table);
      })
      .catch((error) => {
        console.error('Este es el error:', error);
      });
  };

  //traer las tablas
  useEffect(() => {
    getAllTablesToSet();
  }, []);

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4">
          <h1 className="text-4xl">Tablas</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-main-table"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Tabla
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
                  Grosor
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
                  Material
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables.map((table) => (
                <tr key={table.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.width}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.thickness}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.material}
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

export { MainTable };
