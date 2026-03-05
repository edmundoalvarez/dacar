import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

// ACTUALIZAR MÓDULO DENTRO DEL MUEBLE
async function updateModuleOfFurniture(furnitureId, moduleId, updatedModule) {
  const token = Cookies.get("token");
  const res = await axios.put(
    `${config.apiFurnitures}/${furnitureId}/ver-modulos/${moduleId}`,
    updatedModule,
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { updateModuleOfFurniture };
