import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS CLIENTES CREADOS
async function getAllClientsList(term = "", page = 1, itemsPerPage = 10) {
  try {
    const res = await axios.get(`${config.apiClients}/list`, {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },

      params: {
        page: page,
        limit: itemsPerPage,
        search: term, // Agrega el término de búsqueda
      },
    });
    return {
      clients: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

export { getAllClientsList };
