// services/FurnitureCategories/createFurnitureCategory.js
import axios from "axios";
import config from "../../config.json";

async function createFurnitureCategory(payload) {
  const res = await axios.post(`${config.apiFurnitureCategories}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export { createFurnitureCategory };
