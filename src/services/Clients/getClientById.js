import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS MODULOS CREADOS
async function getClientById(clientId) {
  const res = await axios.get(`${config.apiClients}/${clientId}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { getClientById };
