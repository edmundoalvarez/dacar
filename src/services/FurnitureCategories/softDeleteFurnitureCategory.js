// services/FurnitureCategories/softDeleteFurnitureCategory.js
import axios from "axios";
import config from "../../config.json";

async function softDeleteFurnitureCategory(categoryId, replacementCategoryId) {
  const res = await axios.delete(
    `${config.apiFurnitureCategories}/soft-delete/${categoryId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      data: replacementCategoryId ? { replacementCategoryId } : {},
    }
  );

  return res.data;
}

export { softDeleteFurnitureCategory };
