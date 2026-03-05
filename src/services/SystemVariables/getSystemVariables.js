import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config.json";

async function getSystemVariables(signal) {
  const token = Cookies.get("token");
  const res = await axios.get(`${config.apiSystemVariables}`, {
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
    signal,
  });

  const data = res.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.variables)) {
    return data.variables;
  }
  return [];
}

export { getSystemVariables };
