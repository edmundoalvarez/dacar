import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ELIMINAR UN MUEBLE
async function deleteFurniture(furnitureId) {
  const res = await axios.delete(
    `${config.apiFurnitures}/delete-furniture/${furnitureId}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { deleteFurniture };
