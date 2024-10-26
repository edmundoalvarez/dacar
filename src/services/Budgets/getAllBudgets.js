import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS MODULOS CREADOS
async function getAllBudgets(term = "", page = 1, itemsPerPage = 10) {
  try {
    const res = await axios.get(`${config.apiBudgets}`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page: page,
        limit: itemsPerPage,
        search: term, // Agrega el término de búsqueda
      },
    });
    return {
      budgets: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
}

export { getAllBudgets };
