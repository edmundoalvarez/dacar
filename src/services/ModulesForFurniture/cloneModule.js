import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//DUPLICAR MODULO Y SUS PIEZAS
async function cloneModule(moduleId) {
  const token = Cookies.get("token");
  const res = await axios.get(`${config.apiModules}/clone-module/${moduleId}`, {
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });
  return res.data._id;
}
export { cloneModule };
