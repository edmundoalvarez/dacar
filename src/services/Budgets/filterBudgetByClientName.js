import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//FILTRAR MUEBLE POR NOMBRE
async function filterBudgetByClientName(name) {
  const res = await axios.get(
    `${config.apiBudgets}/find-by-client-name/${name}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { filterBudgetByClientName };
