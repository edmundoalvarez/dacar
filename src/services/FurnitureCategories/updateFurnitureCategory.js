// services/FurnitureCategories/updateFurnitureCategory.js
import axios from "axios";
import config from "../../config.json";

async function updateFurnitureCategory(id, payload) {
  const res = await axios.put(
    `${config.apiFurnitureCategories}/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

export { updateFurnitureCategory };
