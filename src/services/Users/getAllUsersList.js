// services/users.js (mejor que siga este nombre, ya no es clients.js)
import axios from "axios";
import config from "../../config.json";

/**
 * Trae usuarios paginados con búsqueda, soportando cancelación via AbortController.
 * @param {string} term         Texto de búsqueda
 * @param {number} page         Página (1-based)
 * @param {number} itemsPerPage Límite por página
 * @param {AbortSignal} signal  (opcional) signal para abortar la request
 */
async function getAllUsersList(term = "", page = 1, itemsPerPage = 10, signal) {
  try {
    const res = await axios.get(`${config.apiUsers}/list`, {
      headers: { "Content-Type": "application/json" },
      params: { page, limit: itemsPerPage, search: term },
      signal,
    });

    return {
      users: res.data?.data ?? [],
      currentPage: res.data?.currentPage ?? 1,
      totalPages: res.data?.totalPages ?? 1,
    };
  } catch (error) {
    if (
      axios.isCancel?.(error) ||
      error?.name === "CanceledError" ||
      error?.name === "AbortError"
    ) {
      return null;
    }
    console.error("Error fetching users:", error);
    throw error;
  }
}

export { getAllUsersList };
