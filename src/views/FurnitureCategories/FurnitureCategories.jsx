// views/FurnitureCategories/FurnitureCategories.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import parse from "html-react-parser"; // 👈 NUEVO
import {
  getFurnitureCategories,
  softDeleteFurnitureCategory,
} from "../../index.js";

function FurnitureCategories() {
  const ENV = import.meta.env.VITE_ENV;

  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // paginado en front
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // borrar / reemplazar
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteMode, setDeleteMode] = useState("soft"); // "soft" | "replace"
  const [replacementCategoryId, setReplacementCategoryId] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(false);

  const controllerRef = useRef(null);
  const navigate = useNavigate();

  const fetchCategories = useCallback(
    async ({ showMainLoader = false } = {}) => {
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (showMainLoader) setLoader(true);

      try {
        const data = await getFurnitureCategories(controller.signal);
        setCategories(data || []);
      } catch (err) {
        console.error("Error al obtener categorías de muebles:", err);
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories({ showMainLoader: true });
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchCategories]);

  // búsqueda en front con debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        setSearchTerm(term);
        setCurrentPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchLoader(true);
    debouncedSearch(term);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((cat) => cat.name.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // abrir modal eliminar
  function handleDeleteCategory(categoryId) {
    setCategoryToDelete(categoryId);
    setDeleteMode("soft");
    setReplacementCategoryId("");
    setOpenModalToDelete(true);
  }

  // categorías para usar como reemplazo (todas menos la actual)
  const replacementOptions = useMemo(() => {
    return categories.filter(
      (c) => c._id !== categoryToDelete && c.status === true
    );
  }, [categories, categoryToDelete]);

  async function confirmDelete() {
    if (!categoryToDelete) return;
    try {
      setDeleteLoader(true);

      const replacementId =
        deleteMode === "replace" ? replacementCategoryId : null;

      await softDeleteFurnitureCategory(categoryToDelete, replacementId);

      // refrescar lista
      await fetchCategories({ showMainLoader: true });

      setOpenModalToDelete(false);
      setCategoryToDelete(null);
      setReplacementCategoryId("");
      setDeleteMode("soft");
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    } finally {
      setDeleteLoader(false);
    }
  }

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">
            Categorías de Muebles
          </h1>

          {/* búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              onChange={handleSearchChange}
              placeholder="Buscar por nombre"
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

          <div className="flex gap-3">
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_back.svg" alt="Volver" className="w-[20px]" />
              <p className="m-0 leading-loose">Volver al Inicio</p>
            </Link>
            <Link
              to="/crear-categoria-mueble"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_add.svg" alt="Crear" className="w-[20px]" />
              <p className="m-0 leading-loose">Crear Categoría</p>
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
            <table className="min-w-full divide-y divide-gray-200 shadow-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Parámetros
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-gray-100 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cat.name}
                    </td>

                    {/* 👇 Parámetros renderizados como HTML enriquecido */}
                    <td className="px-6 py-4 text-sm text-left align-top">
                      <div
                        className="
                          text-gray-700
                          max-h-40 overflow-y-auto
                          [&_ul]:list-disc
                          [&_ul]:list-inside
                          [&_ul]:ml-4
                          [&_p]:mb-1
                        "
                      >
                        {cat.parameter ? (
                          parse(cat.parameter)
                        ) : (
                          <span className="text-gray-400 italic">
                            Sin parámetros
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-sm">
                      {cat.status ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                          Activa
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center align-middle gap-2">
                        <Link
                          to={`/editar-categoria-mueble/${cat._id}`}
                          className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_edit.svg"
                            alt="Editar"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Editar</p>
                        </Link>
                        {cat.status && (
                          <button
                            className="text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                            onClick={() => handleDeleteCategory(cat._id)}
                          >
                            <img
                              src="./../icon_delete.svg"
                              alt="Eliminar"
                              className="w-[18px]"
                            />
                            <p className="m-0 leading-loose">Eliminar</p>
                          </button>
                        )}
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
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duración-300 ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal eliminar / reemplazar */}
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 max-w-lg w-full text-black">
            <h2 className="text-xl font-semibold text-center">
              ¿Qué deseas hacer con esta categoría?
            </h2>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deleteMode"
                  value="soft"
                  checked={deleteMode === "soft"}
                  onChange={() => setDeleteMode("soft")}
                />
                <span>
                  Solo desactivarla (los muebles seguirán apuntando a ella)
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deleteMode"
                  value="replace"
                  checked={deleteMode === "replace"}
                  onChange={() => setDeleteMode("replace")}
                />
                <span>
                  Desactivarla y reemplazarla en todos los muebles por otra
                  categoría
                </span>
              </label>
            </div>

            {deleteMode === "replace" && (
              <div className="mt-2">
                <label
                  htmlFor="replacementCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Categoría de reemplazo
                </label>
                <select
                  id="replacementCategory"
                  value={replacementCategoryId}
                  onChange={(e) => setReplacementCategoryId(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                >
                  <option value="">Selecciona una categoría</option>
                  {replacementOptions.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={confirmDelete}
                disabled={
                  deleteLoader ||
                  (deleteMode === "replace" && !replacementCategoryId)
                }
              >
                {deleteLoader && (
                  <Oval
                    visible={deleteLoader}
                    height="20"
                    width="20"
                    color="#ffffff"
                    secondaryColor="#ffffff"
                    strokeWidth="6"
                    ariaLabel="oval-loading"
                  />
                )}
                <span>Confirmar</span>
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

export { FurnitureCategories };
