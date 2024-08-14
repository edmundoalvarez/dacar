import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllModules,
  cloneModule,
  deleteOriginalModule,
} from "../../index.js";
function Modules() {
  const [modules, setModules] = useState([]);
  //eliminar modulo
  const [openModalToDeleteModule, setOpenModalToDeleteModule] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const getAllModulesToSet = () => {
    getAllModules()
      .then((modulesData) => {
        setModules(modulesData.data);
        console.log(modulesData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //eliminar modulo
  function handleDeleteModule(moduleId) {
    setOpenModalToDeleteModule(true);
    setModuleToDelete(moduleId);
  }

  function deleteSingleModule(moduleId) {
    deleteOriginalModule(moduleId)
      .then((res) => {
        getAllModulesToSet();
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar el modulo
    setOpenModalToDeleteModule(false);
    setModuleToDelete(null);
  }

  //clonar módulo
  async function handleCloneModule(moduleId) {
    await cloneModule(moduleId);
    getAllModulesToSet();
  }

  //traer los modulos
  useEffect(() => {
    getAllModulesToSet();
  }, []);

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4">
          <h1 className="text-4xl">Módulos</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-modulo"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Modulo
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
                  Profundidad
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
                  Cant. Piezas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider "
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map((module) => (
                <tr key={module._id} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.width}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.pieces_number}
                  </td>
                  <td>
                    <div className="flex justify-center align-center gap-4">
                      <Link
                        to={`/editar-modulo/${module._id}`}
                        className="bg-orange px-2 rounded-lg hover:bg-amber-400 text-light font-medium "
                      >
                        Editar
                      </Link>

                      <button
                        className="bg-lightblue px-4 rounded-lg hover:bg-emerald-600 text-light font-medium "
                        onClick={() => handleCloneModule(module._id)}
                      >
                        Clonar
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded-lg"
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
      {/* modal de desea eliminar el modulo */}
      {openModalToDeleteModule && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar la pieza?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleModule(moduleToDelete)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => setOpenModalToDeleteModule(false)}
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

export { Modules };
