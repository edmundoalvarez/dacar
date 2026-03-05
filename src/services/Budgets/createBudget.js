import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//CREAR PRESUPUESTO
async function createBudget(data) {
  const token = Cookies.get("token");
  const res = await axios.post(
    config.apiBudgets,
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

export { createBudget };
