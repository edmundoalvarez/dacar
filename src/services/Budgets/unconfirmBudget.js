import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

async function unconfirmBudget(budgetId) {
  const token = Cookies.get("token");

  const res = await axios.patch(
    `${config.apiBudgets}/${budgetId}/unconfirm`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );

  return res.data; // o res, pero lo más prolijo es data
}

export { unconfirmBudget };
