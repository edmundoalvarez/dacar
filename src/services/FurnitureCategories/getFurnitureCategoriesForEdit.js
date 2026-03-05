// services/FurnitureCategories/getFurnitureCategoriesForEdit.js
import axios from "axios";
import config from "../../config.json";

async function getFurnitureCategoriesForEdit(currentCategoryId) {
  const url = currentCategoryId
    ? `${config.apiFurnitureCategories}/for-edit/${currentCategoryId}`
    : `${config.apiFurnitureCategories}/for-edit`;

  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });

  // res.data SIEMPRE ES UN ARRAY → no uses Array.isArray aquí
  return res.data;
}

export { getFurnitureCategoriesForEdit };
