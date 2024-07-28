import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LA PIEZA
async function updateSupplie(supplieId, updatedSupplie) {
  const res = await axios.put(
    `${config.apiSupplies}/edit-supplie/${supplieId}`,
    updatedSupplie,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { updateSupplie };
