import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LAS PLACAS
async function deleteService(serviceId) {
  const res = await axios.delete(`${config.apiServices}/${serviceId}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { deleteService };
