import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS INSUMOS
async function getServiceById(serviceId) {
  const res = await axios.get(`${config.apiServices}/${serviceId}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { getServiceById };
