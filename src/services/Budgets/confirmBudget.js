import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

// CONFIRMAR PRESUPUESTO
async function confirmBudget(budgetId) {
  const token = Cookies.get("token");

  const res = await axios.patch(
    `${config.apiBudgets}/${budgetId}/confirm`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        auth: token, // igual que en createBudget
      },
    }
  );

  // Podés devolver res o res.data según cómo lo uses en el front
  return res;
}

export { confirmBudget };
