import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ACTUALIZAR EL PRESUPUESTO A STATUS: DELETED
async function deleteBudget(budgetId) {
  const res = await axios.patch(
    `${config.apiBudgets}/delete-budget/${budgetId}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { deleteBudget };
