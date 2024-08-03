import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LAS PLACAS
async function getAllVeneerSupplies() {
  const res = await axios.get(`${config.apiSupplies}/veneer`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { getAllVeneerSupplies };
