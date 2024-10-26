import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS INSUMOS
async function getAllServicesList(term = "", page = 1, itemsPerPage = 10) {
  try {
    const res = await axios.get(`${config.apiServices}/list`, {
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
      services: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching servicios:", error);
    throw error;
  }
}

export { getAllServicesList };
