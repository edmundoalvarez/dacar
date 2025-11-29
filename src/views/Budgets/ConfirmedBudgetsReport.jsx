import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Grid, Oval } from "react-loader-spinner";
import debounce from "lodash.debounce";
import {
  getConfirmedBudgets,
  deleteBudget,
  getBudgetHistory,
  unconfirmBudget,
} from "../../index.js";

function ConfirmedBudgetsReport() {
  const [budgets, setBudgets] = useState([]);
  const [loader, setLoader] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  const [searchLoader, setSearchLoader] = useState(false);

  // Eliminar
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  // Historial
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoader, setHistoryLoader] = useState(false);
  const [historyBudgetNumber, setHistoryBudgetNumber] = useState(null);
  const [historyBudgetId, setHistoryBudgetId] = useState(null);

  // Desconfirmar
  const [openModalToUnconfirm, setOpenModalToUnconfirm] = useState(false);
  const [budgetToUnconfirm, setBudgetToUnconfirm] = useState(null);
  const [budgetToUnconfirmNumber, setBudgetToUnconfirmNumber] = useState(null);
  const [unconfirmLoader, setUnconfirmLoader] = useState(false);

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const fetchData = async (
    term,
    from,
    to,
    page,
    { showMainLoader = false } = {}
  ) => {
    if (showMainLoader) setLoader(true);
    try {
      const result = await getConfirmedBudgets(
        term,
        page,
        itemsPerPage,
        from,
        to
      );
      setBudgets(result.data || []);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Error obteniendo presupuestos confirmados:", err);
    } finally {
      setLoader(false);
      setSearchLoader(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm, dateFrom, dateTo, currentPage, {
      showMainLoader: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const debouncedSearch = useMemo(
    () =>
      debounce((term, from, to) => {
        fetchData(term, from, to, 1);
        setCurrentPage(1);
      }, 800),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term, dateFrom, dateTo);
  };

  const handleDateFromChange = (e) => {
    const value = e.target.value;
    setDateFrom(value);
    setSearchLoader(true);
    debouncedSearch(searchTerm, value, dateTo);
  };

  const handleDateToChange = (e) => {
    const value = e.target.value;
    setDateTo(value);
    setSearchLoader(true);
    debouncedSearch(searchTerm, dateFrom, value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchData(searchTerm, dateFrom, dateTo, currentPage - 1, {
        showMainLoader: true,
      });
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchData(searchTerm, dateFrom, dateTo, currentPage + 1, {
        showMainLoader: true,
      });
      setCurrentPage((p) => p + 1);
    }
  };

  /* FUNCIONES ELIMINAR */
  function handleDeleteBudget(budgetId) {
    setOpenModalToDelete(true);
    setBudgetToDelete(budgetId);
  }

  async function deleteSingleBudget() {
    if (!budgetToDelete) return;
    try {
      await deleteBudget(budgetToDelete);
      await fetchData(searchTerm, dateFrom, dateTo, currentPage, {
        showMainLoader: true,
      });
    } catch (error) {
      console.error("Error eliminando presupuesto:", error);
    } finally {
      setOpenModalToDelete(false);
      setBudgetToDelete(null);
    }
  }

  /* FUNCIONES HISTORIAL */
  const handleOpenHistory = async (budget) => {
    try {
      setHistoryBudgetNumber(budget.budget_number);
      setHistoryBudgetId(budget._id);
      setHistoryModalOpen(true);
      setHistoryLoader(true);

      const logs = await getBudgetHistory(budget._id);
      setHistoryEntries(logs || []);
    } catch (err) {
      console.error("Error al obtener historial del presupuesto:", err);
      setHistoryEntries([]);
    } finally {
      setHistoryLoader(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryEntries([]);
    setHistoryBudgetNumber(null);
    setHistoryBudgetId(null);
  };

  /* FUNCIONES DESCONFIRMAR */
  function handleOpenUnconfirmBudget(budget) {
    setBudgetToUnconfirm(budget._id);
    setBudgetToUnconfirmNumber(budget.budget_number);
    setOpenModalToUnconfirm(true);
  }

  function handleCloseUnconfirmModal() {
    setOpenModalToUnconfirm(false);
    setBudgetToUnconfirm(null);
    setBudgetToUnconfirmNumber(null);
    setUnconfirmLoader(false);
  }

  async function unconfirmSingleBudget() {
    if (!budgetToUnconfirm) return;

    try {
      setUnconfirmLoader(true);

      await unconfirmBudget(budgetToUnconfirm);

      // recargo lista de confirmados; este presupuesto ya no va a aparecer aquí
      await fetchData(searchTerm, dateFrom, dateTo, currentPage, {
        showMainLoader: true,
      });

      handleCloseUnconfirmModal();
    } catch (error) {
      console.error("Error desconfirmando presupuesto:", error);
      alert("Ocurrió un error al desconfirmar el presupuesto.");
      setUnconfirmLoader(false);
    }
  }

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-3xl font-semibold text-white">
            Presupuestos confirmados
          </h1>

          {/* Filtros */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre de cliente"
                className="border border-gray-300 p-2 rounded-lg shadow-md w-[260px]"
              />
              <Oval
                visible={searchLoader}
                height="28"
                width="28"
                color="rgb(92, 92, 92)"
                secondaryColor="rgb(92, 92, 92)"
                strokeWidth="6"
                ariaLabel="oval-loading"
              />
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <div className="flex flex-col">
                <span>Desde</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  className="border border-gray-300 p-1 rounded-lg text-black"
                />
              </div>
              <div className="flex flex-col">
                <span>Hasta</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  className="border border-gray-300 p-1 rounded-lg text-black"
                />
              </div>
            </div>
          </div>

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
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {/* Caso: loader */}
              {loader && (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <Grid
                      visible={true}
                      height="60"
                      width="60"
                      color="rgb(92, 92, 92)"
                      ariaLabel="grid-loading"
                    />
                  </td>
                </tr>
              )}

              {/* Caso: no hay resultados */}
              {!loader && budgets.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No hay presupuestos confirmados aún.
                  </td>
                </tr>
              )}

              {/* Caso: lista con datos */}
              {!loader &&
                budgets.length > 0 &&
                budgets.map((budget) => (
                  <tr key={budget._id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.budget_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.date
                        ? new Date(budget.date).toLocaleDateString("es-AR")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.client?.map((client) => (
                        <div key={client._id}>
                          {client.name} {client.lastname}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.furniture_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center align-middle gap-2">
                        <Link
                          className="text-white bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          to={`/ver-presupuestos/${budget._id}?from=confirmed`}
                        >
                          <img
                            src="./../icon_search.svg"
                            alt="Ver"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Ver</p>
                        </Link>

                        <Link
                          to={`/editar-presupuestos/${budget._id}?from=confirmed`}
                          className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_edit.svg"
                            alt="Editar"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Editar</p>
                        </Link>

                        {/* DESCONFIRMAR */}
                        <button
                          onClick={() => handleOpenUnconfirmBudget(budget)}
                          className="text-white bg-red-800 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_cancel.svg"
                            alt="Desconfirmar"
                            className="w-[18px]"
                          />
                          <p className="m-0 leading-loose text-sm">
                            Desconfirmar
                          </p>
                        </button>

                        {/* ELIMINAR */}
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

                        {/* HISTORIAL */}
                        <button
                          onClick={() => handleOpenHistory(budget)}
                          className="text-white bg-gray-900 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_history.svg"
                            alt="Historial"
                            className="w-[16px]"
                          />
                          <p className="m-0 leading-loose text-sm">Historial</p>
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
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el presupuesto?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={deleteSingleBudget}
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
      {historyModalOpen && (
        <div
          onClick={handleCloseHistoryModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-lg shadow-lg max-h-[600px] w-full max-w-3xl overflow-y-auto relative text-black"
          >
            <button
              onClick={handleCloseHistoryModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-2">
              Historial de presupuesto Nº {historyBudgetNumber}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              ID presupuesto:{" "}
              <span className="font-mono text-xs">{historyBudgetId}</span>
            </p>

            {historyLoader ? (
              <div className="flex justify-center items-center h-32">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="rgb(92, 92, 92)"
                  secondaryColor="rgb(92, 92, 92)"
                  strokeWidth="6"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : historyEntries.length === 0 ? (
              <p className="text-sm text-gray-600">
                No hay actividad registrada para este presupuesto.
                <br />
                Es posible que haya sido creado antes de implementar el
                historial.
              </p>
            ) : (
              <ul className="space-y-4">
                {historyEntries.map((log) => (
                  <li
                    key={log._id}
                    className="border border-gray-200 rounded-md p-3 text-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">
                        {log.action === "create"
                          ? "Creación"
                          : log.action === "update"
                          ? "Actualización"
                          : log.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 mb-1">
                      <span className="font-bold">Usuario: </span>
                      {log.user?.username ||
                        log.user?.email ||
                        "Usuario desconocido"}
                    </div>

                    {log.meta && (
                      <div className="text-xs text-gray-700">
                        {log.meta.clientName && (
                          <p className="m-0">
                            <span className="font-bold">Cliente: </span>
                            {log.meta.clientName}
                          </p>
                        )}
                        {log.meta.changeType === "budget_create" && (
                          <p className="m-0">
                            Presupuesto creado en el sistema.
                          </p>
                        )}
                        {log.meta.changeType === "budget_update" && (
                          <p className="m-0">
                            Presupuesto editado en el sistema.
                          </p>
                        )}
                        {log.meta.changeType === "budget_unconfirmed" && (
                          <p className="m-0">Presupuesto desconfirmado.</p>
                        )}
                        {log.meta.changeType === "budget_confirmed" && (
                          <p className="m-0">Presupuesto confirmado.</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseHistoryModal}
                className="bg-red-500 text-white py-2 px-6 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {openModalToUnconfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col text-black max-w-md w-full">
            <h2 className="text-xl mb-4 text-center font-semibold">
              ¿Seguro que deseas desconfirmar el presupuesto
              {budgetToUnconfirmNumber ? ` Nº ${budgetToUnconfirmNumber}` : ""}?
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Este presupuesto dejará de estar en la lista de confirmados y
              volverá a la vista general de presupuestos.
            </p>

            <div className="flex gap-4 items-center">
              <button
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={unconfirmSingleBudget}
                disabled={unconfirmLoader}
              >
                {unconfirmLoader && (
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="rgb(255,255,255)"
                    secondaryColor="rgb(230,230,230)"
                    strokeWidth="6"
                    ariaLabel="oval-loading"
                  />
                )}
                <span>Desconfirmar</span>
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-4 rounded"
                onClick={handleCloseUnconfirmModal}
                disabled={unconfirmLoader}
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

export { ConfirmedBudgetsReport };
