import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

async function getBudgetHistory(budgetId) {
  const token = Cookies.get("token");

  const res = await axios.get(`${config.apiBudgets}/${budgetId}/history`, {
    headers: {
      auth: token,
    },
  });

  // El back responde { ok: true, data: logs }
  return res.data.data;
}

export { getBudgetHistory };
