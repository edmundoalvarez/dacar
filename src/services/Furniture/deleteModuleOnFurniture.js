import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ELIMINAR UNA PIEZA
async function deleteModuleOnFurniture(furnitureId, moduleId) {
  const res = await axios.patch(
    `${config.apiFurnitures}/modulo-en-mueble/${furnitureId}/${moduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { deleteModuleOnFurniture };
