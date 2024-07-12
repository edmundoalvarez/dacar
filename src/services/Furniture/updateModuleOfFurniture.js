import axios from "axios";
import config from "../../config.json";

// ACTUALIZAR MÓDULO DENTRO DEL MUEBLE
async function updateModuleOfFurniture(furnitureId, moduleId, updatedModule) {
    const res = await axios.put(
      `${config.apiFurnitures}/${furnitureId}/ver-modulos/${moduleId}`,
      updatedModule,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
}

export { updateModuleOfFurniture };
