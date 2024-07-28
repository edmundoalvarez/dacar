import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LA PIEZA
async function updateService(serviceId, updatedService) {
  const res = await axios.put(
    `${config.apiServices}/edit-service/${serviceId}`,
    updatedService,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { updateService };
