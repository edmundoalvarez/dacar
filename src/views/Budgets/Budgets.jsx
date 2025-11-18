import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllBudgets, deleteBudget } from "../../index.js";

function Budgets() {
  const ENV = import.meta.env.VITE_ENV;

  const [budgets, setBudgets] = useState([]);
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const [loader, setLoader] = useState(true); // loader general (paginación/primera carga)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false); // loader del buscador

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // AbortController de la request en curso
  const controllerRef = useRef(null);
  // Secuencia para evitar “out-of-order”
  const reqSeqRef = useRef(0);

  const getAllBudgetsToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      // cancelar request previa
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current; // id de esta request

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllBudgets(
          term,
          page,
          itemsPerPage,
          controller.signal
        );
        // si fue cancelada o llegó fuera de orden, salimos
        if (!data || seq !== reqSeqRef.current) return;

        setBudgets(data.budgets);
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

  // Carga inicial y cambio de página (respetando el término actual)
  useEffect(() => {
    getAllBudgetsToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, searchTerm, getAllBudgetsToSet]);

  // Debounce estable para búsqueda
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        // al buscar, siempre volvemos a la página 1
        getAllBudgetsToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getAllBudgetsToSet]
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
      getAllBudgetsToSet(searchTerm, currentPage - 1, { showMainLoader: true });
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllBudgetsToSet(searchTerm, currentPage + 1, { showMainLoader: true });
      setCurrentPage((p) => p + 1);
    }
  };

  // Eliminar presupuesto
  function handleDeleteBudget(budgetId) {
    setOpenModalToDelete(true);
    setBudgetToDelete(budgetId);
  }

  function deleteSingleBudget(budgetId) {
    deleteBudget(budgetId)
      .then(() => {
        // refrescamos respetando término y página actuales
        getAllBudgetsToSet(searchTerm, currentPage, { showMainLoader: true });
      })
      .catch((error) => {
        console.error(error);
      });

    setOpenModalToDelete(false);
    setBudgetToDelete(null);
  }

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Presupuestos</h1>

          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre de cliente"
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
              <img
                src="./icon_back.svg"
                alt="Icono de budgets"
                className="w-[20px]"
              />
              <p className="m-0 leading-loose">Volver al Inicio</p>
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
                    Número
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Nombre del mueble
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map((budget) => (
                  <tr key={budget._id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.budget_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(budget.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.client.map((client) => (
                        <div key={client._id}>
                          {client.name} {client.lastname}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.furniture_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center align-middle gap-4">
                        <Link
                          className="text-white bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          to={`/ver-presupuestos/${budget._id}`}
                        >
                          <img
                            src="./../icon_search.svg"
                            alt="Ver"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Ver</p>
                        </Link>
                        <Link
                          to={`/editar-presupuestos/${budget._id}`}
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
                          onClick={() => handleDeleteBudget(budget._id)}
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

      {/* Modal eliminar */}
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el presupuesto?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleBudget(budgetToDelete)}
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

export { Budgets };
