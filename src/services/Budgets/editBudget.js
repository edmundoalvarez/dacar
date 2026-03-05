import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//EDITAR PRESUPUESTO
async function editBudget(data, budgetId) {
  const token = Cookies.get("token");

  const res = await axios.put(
    `${config.apiBudgets}/edit-budget/${budgetId}`,
    {
      ...data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { editBudget };
