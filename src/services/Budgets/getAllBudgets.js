// services/budgets.js
import axios from "axios";
import config from "../../config.json";

/**
 * Trae presupuestos paginados con filtros, soportando cancelación via AbortController.
 * @param {Object} options
 * @param {string} options.term          Texto de búsqueda (cliente)
 * @param {number} options.page          Página (1-based)
 * @param {number} options.itemsPerPage  Límite por página
 * @param {string} options.furnitureName Nombre del mueble
 * @param {string} options.budgetNumber  Número de presupuesto
 * @param {string} options.dateFrom      Fecha desde (YYYY-MM-DD)
 * @param {string} options.dateTo        Fecha hasta (YYYY-MM-DD)
 * @param {AbortSignal} options.signal   (opcional) signal para abortar la request
 */
async function getAllBudgets({
  term = "",
  page = 1,
  itemsPerPage = 10,
  furnitureName = "",
  budgetNumber = "",
  dateFrom = "",
  dateTo = "",
  signal,
} = {}) {
  try {
    const res = await axios.get(`${config.apiBudgets}`, {
      headers: { "Content-Type": "application/json" },
      params: {
        page,
        limit: itemsPerPage,
        search: term,
        ...(furnitureName ? { furnitureName } : {}),
        ...(budgetNumber ? { budgetNumber } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      },
      signal, // <- habilita abortar
    });

    return {
      budgets: res.data?.data ?? [],
      currentPage: res.data?.currentPage ?? 1,
      totalPages: res.data?.totalPages ?? 1,
    };
  } catch (error) {
    // Si fue abortada, no lo tratamos como error real
    if (
      axios.isCancel?.(error) ||
      error?.name === "CanceledError" ||
      error?.name === "AbortError"
    ) {
      return null; // el caller debe ignorar y no actualizar estado
    }
    console.error("Error fetching budgets:", error);
    throw error;
  }
}

export { getAllBudgets };
