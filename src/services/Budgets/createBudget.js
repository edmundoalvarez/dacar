import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie"; */
/* const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//CREAR MUEBLE
async function createBudget(data) {
  const res = await axios.post(
    config.apiBudgets,
    {
      ...data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        /* auth: token, */
      },
    }
  );
  return res;
}

export { createBudget };
