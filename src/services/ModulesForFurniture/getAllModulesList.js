// services/modules.js
import axios from "axios";
import config from "../../config.json";

/**
 * Trae módulos paginados con búsqueda, soportando cancelación via AbortController.
 * @param {string} term         Texto de búsqueda
 * @param {number} page         Página (1-based)
 * @param {number} itemsPerPage Límite por página
 * @param {AbortSignal} signal  (opcional) signal para abortar la request
 */
async function getAllModulesList(
  term = "",
  page = 1,
  itemsPerPage = 10,
  signal
) {
  try {
    const res = await axios.get(`${config.apiModules}/list`, {
      headers: { "Content-Type": "application/json" },
      params: { page, limit: itemsPerPage, search: term },
      signal, // <- importante para poder abortar
    });

    return {
      modules: res.data?.data ?? [],
      currentPage: res.data?.currentPage ?? 1,
      totalPages: res.data?.totalPages ?? 1,
    };
  } catch (error) {
    // Si la request fue cancelada, no lo tratamos como error “real”
    if (
      axios.isCancel?.(error) ||
      error?.name === "CanceledError" ||
      error?.name === "AbortError"
    ) {
      return null; // el caller debe ignorar y no actualizar estado
    }
    console.error("Error fetching modules:", error);
    throw error;
  }
}

export { getAllModulesList };
