import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import {
  getAllModulesList,
  cloneModule,
  deleteOriginalModule,
  filterModuleByName,
  ViewModulesFurniture,
  getPiecesByModuleId,
} from "../../index.js";

function Modules() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Límite de insumos por página

  //eliminar modulo
  const [openModalToDeleteModule, setOpenModalToDeleteModule] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const getAllModulesToSet = (term = "", page = 1) => {
    setLoader(true);
    getAllModulesList(term, page, itemsPerPage)
      .then((modulesData) => {
        setModules(modulesData.modules);
        setCurrentPage(modulesData.currentPage);
        setTotalPages(modulesData.totalPages);
        setLoader(false);
        setSearchLoader(false);
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
        setSearchLoader(false);
      });
  };

  // Manejar la búsqueda de modulos
  const handleSearch = debounce((term) => {
    setCurrentPage(1); // Restablece la página a 1 al buscar
    getAllModulesToSet(term, 1); // Filtra desde la primera página
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    handleSearch(term);
  };

  // Controladores de cambio de página
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllModulesToSet(searchTerm, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllModulesToSet(searchTerm, currentPage + 1);
    }
  };

  //eliminar modulo
  function handleDeleteModule(moduleId) {
    setOpenModalToDeleteModule(true);
    setModuleToDelete(moduleId);
  }

  function deleteSingleModule(moduleId) {
    deleteOriginalModule(moduleId)
      .then((res) => {
        getAllModulesToSet((term = ""), (page = 1));
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
    getAllModulesToSet((term = ""), (page = 1));
  }

  //traer los modulos
  useEffect(() => {
    getAllModulesToSet(searchTerm, currentPage);
  }, [currentPage]);

  // Manejo de la ventana modal
  const handleOpenModal = async (module) => {
    try {
      // Obtén las piezas por el ID del módulo
      const pieces = await getPiecesByModuleId(module._id);

      // Agrega las piezas al módulo bajo el nombre 'pieces'
      const moduleWithPieces = { ...module, pieces };

      // Envuelve el módulo en un array y establece 'selectedModules'
      setSelectedModule([moduleWithPieces]);

      // Abre la modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener las piezas del módulo:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="">
        <div className="flex gap-4 items-center py-4 px-8">
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
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border border-gray-400 p-2 rounded-lg ml-auto"
            />

            <Oval
              visible={searchLoader}
              height="30"
              width="30"
              color="rgb(92, 92, 92)"
              secondaryColor="rgb(92, 92, 92)"
              strokeWidth="6"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
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
                  Alto
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
                  Material
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
                    {module.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.width}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.pieces_number}
                  </td>
                  <td>
                    <div className="flex justify-center align-center gap-4">
                      <button
                        className="bg-blue-500 px-4 rounded-lg hover:bg-blue-800 text-light font-medium "
                        onClick={() => handleOpenModal(module)}
                      >
                        Ver
                      </button>
                      <Link
                        to={`/editar-modulo/${module._id}`}
                        className="text-white bg-orange hover:bg-amber-600 rounded-md px-2 py-1 text-center "
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
          <div className="flex justify-center w-full mt-8">
            <Grid
              visible={loader}
              height="80"
              width="80"
              color="rgb(92, 92, 92)"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass="grid-wrapper"
            />
          </div>
        </div>
        {/* Controles de Paginación */}
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
      ${
        currentPage === 1
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
          >
            Anterior
          </button>
          <span className="text-lg font-medium">
            Página <span>{currentPage}</span> de <span>{totalPages}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
      ${
        currentPage === totalPages
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* Abrimos la modal en caso que el estado isModalOpen cambie */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal} // Cierra la modal si se hace clic fuera de ella
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal la cierre
            className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-[550px] overflow-y-auto relative m-8"
          >
            {/* Botón de cierre en la esquina superior derecha */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            {/* Contenido de la modal */}
            <ViewModulesFurniture sortedModules={selectedModule} />

            <div className="flex justify-center items-center m-auto gap-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal de desea eliminar el modulo */}
      {openModalToDeleteModule && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el módulo?
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
