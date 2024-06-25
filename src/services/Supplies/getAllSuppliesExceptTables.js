import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS INSUMOS MENOS TABLAS
async function getAllSuppliesExceptTables() {
  const res = await axios.get(`${config.apiSupplies}/supplies-not-tables`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { getAllSuppliesExceptTables };
