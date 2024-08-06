import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER ÚLITMO NUMERO DE PRESUPUESTO
async function getLastBudgetNum() {
  try {
    const res = await axios.get(`${config.apiBudgets}/last-number`, {
      headers: {
        "Content-Type": "application/json",
        // auth: token, // Descomentar si necesitas autenticar la solicitud
      },
    });
    return res.data.budget_number; // Asegúrate de retornar el número de presupuesto
  } catch (err) {
    console.error("Error fetching last budget number:", err);
    throw err;
  }
}
export { getLastBudgetNum };
