import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config.json";

async function createSystemVariable(payload) {
  const token = Cookies.get("token");
  const res = await axios.post(`${config.apiSystemVariables}`, payload, {
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });

  return res.data?.variable;
}

export { createSystemVariable };
