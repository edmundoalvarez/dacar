import axios from "axios";
import config from "../../config.json";

// ACTUALIZAR MÓDULO DENTRO DEL MUEBLE
async function updateFurniture(furnitureId, updatedFurniture) {
  // console.log("updatedFurniture", updatedFurniture);
  const res = await axios.put(
    `${config.apiFurnitures}/update-furniture/${furnitureId}`,
    updatedFurniture,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}

export { updateFurniture };
