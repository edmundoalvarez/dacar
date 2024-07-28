import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LAS CATEGORIAS DE LOS INSUMOS
async function getAllSuppliesCategories() {
  const res = await axios.get(`${config.apiSuppliesCategory}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { getAllSuppliesCategories };
