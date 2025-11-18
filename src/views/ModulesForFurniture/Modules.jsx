import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import {
  getAllModulesList,
  cloneModule,
  deleteOriginalModule,
  ViewModulesFurniture,
  getPiecesByModuleId,
} from "../../index.js";

function Modules() {
  const ENV = import.meta.env.VITE_ENV;

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // AbortController actual para abortar la request previa
  const controllerRef = useRef(null);
  // “sequence id” para evitar respuestas fuera de orden
  const reqSeqRef = useRef(0);

  const getAllModulesToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      // abortar request previa si existe
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current; // id de request

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllModulesList(
          term,
          page,
          itemsPerPage,
          controller.signal
        );

        // Si fue cancelada o llegó fuera de orden, no tocar estado
        if (!data || seq !== reqSeqRef.current) return;

        setModules(data.modules);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (_) {
        // si no fue cancelación, ya lo loguea el service
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  // Primera carga + cambio de página conservando el término
  useEffect(() => {
    getAllModulesToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, getAllModulesToSet, searchTerm]);

  // Debounce estable para búsqueda
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        // Siempre volver a página 1 al buscar
        getAllModulesToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getAllModulesToSet]
  );

  // Cleanup al desmontar: cancelar debounce y request
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);

  // Input de búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term);
  };

  // Paginación manteniendo el término actual
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllModulesToSet(searchTerm, currentPage - 1, { showMainLoader: true });
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllModulesToSet(searchTerm, currentPage + 1, { showMainLoader: true });
      setCurrentPage((p) => p + 1);
    }
  };

  // Eliminar módulo
  const [openModalToDeleteModule, setOpenModalToDeleteModule] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  function handleDeleteModule(moduleId) {
    setOpenModalToDeleteModule(true);
    setModuleToDelete(moduleId);
  }

  function deleteSingleModule(moduleId) {
    deleteOriginalModule(moduleId)
      .then(() => {
        getAllModulesToSet(searchTerm, currentPage, { showMainLoader: true });
      })
      .catch((error) => {
        console.error(error);
      });

    setOpenModalToDeleteModule(false);
    setModuleToDelete(null);
  }

  // Clonar módulo
  async function handleCloneModule(moduleId) {
    await cloneModule(moduleId);
    getAllModulesToSet(searchTerm, currentPage, { showMainLoader: true });
  }

  // Modal de ver piezas del módulo
  const handleOpenModal = async (module) => {
    try {
      const pieces = await getPiecesByModuleId(module._id);
      const moduleWithPieces = { ...module, pieces };
      setSelectedModule([moduleWithPieces]);
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
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Módulos</h1>

          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre o descripción"
              className="border border-gray-300 p-2 rounded-lg ml-auto shadow-md w-[400px]"
            />
            <Oval
              visible={searchLoader}
              height="30"
              width="30"
              color="rgb(92, 92, 92)"
              secondaryColor="rgb(92, 92, 92)"
              strokeWidth="6"
              ariaLabel="oval-loading"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_back.svg" alt="Volver" className="w-[20px]" />
              <p className="m-0 leading-loose">Volver al Inicio</p>
            </Link>
            <Link
              to="/crear-modulo"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_add.svg" alt="Crear" className="w-[20px]" />
              <p className="m-0 leading-loose">Crear Módulo</p>
            </Link>
          </div>
        </div>

        {ENV === "TEST" && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
            ⚠️ Estás en entorno de pruebas (TEST)
          </div>
        )}

        <div className="overflow-x-auto mt-4">
          <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3  max-w-[150px] text-center text-xs font-medium text-light uppercase tracking-wider">
                    Largo x Alto x Profundidad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Cant. Piezas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider ">
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
                    <td className="px-6 py-4 max-w-[400px]  text-sm text-gray-500">
                      {module.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {module.length} x {module.height} x {module.width}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {module.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {module.pieces_number}
                    </td>
                    <td>
                      <div className="flex justify-center align-middle gap-4">
                        <button
                          className="text-white bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          onClick={() => handleOpenModal(module)}
                        >
                          <img
                            src="./../icon_search.svg"
                            alt="Ver"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Ver</p>
                        </button>
                        <Link
                          to={`/editar-modulo/${module._id}`}
                          className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_edit.svg"
                            alt="Editar"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Editar</p>
                        </Link>
                        <button
                          className="text-white bg-lightblue rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          onClick={() => handleCloneModule(module._id)}
                        >
                          <img
                            src="./../icon_clone.svg"
                            alt="Clonar"
                            className="w-[18px]"
                          />
                          <p className="m-0 leading-loose">Clonar</p>
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module._id)}
                          className="text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_delete.svg"
                            alt="Eliminar"
                            className="w-[18px]"
                          />
                          <p className="m-0 leading-loose">Eliminar</p>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
              <Grid
                visible={loader}
                height="80"
                width="80"
                color="rgb(92, 92, 92)"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="grid-wrapper"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 py-8 text-black">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
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
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal ver módulo */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-[550px] overflow-y-auto relative m-8"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <ViewModulesFurniture sortedModules={selectedModule} />

            <div className="flex justify-end m-auto gap-2 mt-4 w-full">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white py-2 px-6 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {openModalToDeleteModule && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 text-black">
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
