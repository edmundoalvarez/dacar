// services/FurnitureCategories/getFurnitureCategoryById.js
import axios from "axios";
import config from "../../config.json";

async function getFurnitureCategoryById(id) {
  const res = await axios.get(`${config.apiFurnitureCategories}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export { getFurnitureCategoryById };
