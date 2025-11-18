import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllSupplies, deleteSupplie } from "../../index.js";

function Supplies() {
  const ENV = import.meta.env.VITE_ENV;

  const [supplies, setSupplies] = useState([]);
  const [loader, setLoader] = useState(true); // loader general (primera carga / paginación)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false); // loader del buscador

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // Eliminar insumo
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [supplieToDelete, setSupplieToDelete] = useState(null);

  // AbortController de la request en curso
  const controllerRef = useRef(null);
  // Id secuencial para evitar respuestas fuera de orden
  const reqSeqRef = useRef(0);

  const getSuppliesToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      // cancelar request previa
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current; // id de esta request

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllSupplies(
          term,
          page,
          itemsPerPage,
          controller.signal
        );
        // si se canceló o llegó fuera de orden, no actualizar estado
        if (!data || seq !== reqSeqRef.current) return;

        setSupplies(data.supplies);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (_) {
        // si no fue cancelación, el service ya loguea
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  // Carga inicial y cuando cambia la página (manteniendo el término actual)
  useEffect(() => {
    getSuppliesToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, searchTerm, getSuppliesToSet]);

  // Debounce estable para búsqueda
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        // al buscar, siempre vamos a la página 1
        getSuppliesToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getSuppliesToSet]
  );

  // Cleanup al desmontar: cancelar debounce y request en curso
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);

  // Input búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term);
  };

  // Paginación manteniendo el término actual
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getSuppliesToSet(searchTerm, currentPage - 1, { showMainLoader: true });
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getSuppliesToSet(searchTerm, currentPage + 1, { showMainLoader: true });
      setCurrentPage((p) => p + 1);
    }
  };

  // Eliminar insumo
  function handleDeleteSupplie(supplieId) {
    setOpenModalToDelete(true);
    setSupplieToDelete(supplieId);
  }

  function deleteSingleSupplie(supplieId) {
    deleteSupplie(supplieId)
      .then(() => {
        // refrescar lista respetando término y página actuales
        getSuppliesToSet(searchTerm, currentPage, { showMainLoader: true });
      })
      .catch((error) => {
        console.error(error);
      });

    setOpenModalToDelete(false);
    setSupplieToDelete(null);
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Insumos</h1>

          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
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
              to="/crear-insumo"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_add.svg" alt="Crear" className="w-[20px]" />
              <p className="m-0 leading-loose">Crear Insumo</p>
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
                    Largo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Ancho
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Grosor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {supplies.map((supplie) => (
                  <tr
                    key={supplie._id}
                    className="hover:bg-gray-100 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.name}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.length}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.width}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.thickness}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.category}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.material}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(supplie.price)}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.supplier_id}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center align-middle gap-2">
                        <Link
                          to={`/editar-insumo/${supplie._id}`}
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
                          className="text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          onClick={() => handleDeleteSupplie(supplie._id)}
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

      {/* Modal eliminar */}
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl text-center mb-4 text-black">
              ¿Seguro que desea eliminar el insumo? <br /> Esto puede generar
              errores al presupuestar.
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleSupplie(supplieToDelete)}
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

export { Supplies };
