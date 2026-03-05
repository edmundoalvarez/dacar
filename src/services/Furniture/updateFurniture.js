import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

// ACTUALIZAR MÓDULO DENTRO DEL MUEBLE
async function updateFurniture(furnitureId, updatedFurniture) {
  const token = Cookies.get("token");
  const res = await axios.put(
    `${config.apiFurnitures}/update-furniture/${furnitureId}`,
    updatedFurniture,
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { updateFurniture };
