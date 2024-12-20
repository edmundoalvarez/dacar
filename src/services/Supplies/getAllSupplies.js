import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODOS LOS INSUMOS
async function getAllSupplies(term = "", page = 1, itemsPerPage = 10) {
  try {
    const res = await axios.get(`${config.apiSupplies}`, {
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
      supplies: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching supplies:", error);
    throw error;
  }
}

export { getAllSupplies };
