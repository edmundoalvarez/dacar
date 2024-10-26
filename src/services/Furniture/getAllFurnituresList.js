import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS MUEBLES CREADOS
async function getAllFurnituresList(term = "", page = 1, itemsPerPage = 10) {
  try {
    const res = await axios.get(`${config.apiFurnitures}/list`, {
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
      furnitures: res.data.data,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching muebles:", error);
    throw error;
  }
}

export { getAllFurnituresList };
