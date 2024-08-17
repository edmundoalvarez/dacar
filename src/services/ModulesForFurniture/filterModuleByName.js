import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//FILTRAR MODULOS POR NOMBRE
async function filterModuleByName(name) {
  const res = await axios.get(`${config.apiModules}/find-by-name/${name}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { filterModuleByName };
