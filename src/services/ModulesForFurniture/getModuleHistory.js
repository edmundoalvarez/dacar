import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//OBTENER EL HISTORIAL DE EDICIÓN
async function getModuleHistory(moduleId, signal) {
  const token = Cookies.get("token");
  const res = await axios.get(`${config.apiModules}/${moduleId}/history`, {
    signal,
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });
  return res.data.data;
}
export { getModuleHistory };
