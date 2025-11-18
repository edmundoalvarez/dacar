// services/furnitures.js
import axios from "axios";
import config from "../../config.json";

async function getAllFurnituresList(
  term = "",
  page = 1,
  itemsPerPage = 10,
  signal
) {
  try {
    const res = await axios.get(`${config.apiFurnitures}/list`, {
      headers: { "Content-Type": "application/json" },
      params: { page, limit: itemsPerPage, search: term },
      signal, // <- importante
    });
    return {
      furnitures: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    // Si fue abortada, no lo trates como error “real”
    if (
      axios.isCancel?.(error) ||
      error.name === "CanceledError" ||
      error.name === "AbortError"
    ) {
      return null;
    }
    console.error("Error fetching muebles:", error);
    throw error;
  }
}

export { getAllFurnituresList };
