import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config.json";

async function updateSystemVariable(id, payload) {
  const token = Cookies.get("token");
  const res = await axios.put(`${config.apiSystemVariables}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });

  return res.data;
}

export { updateSystemVariable };
