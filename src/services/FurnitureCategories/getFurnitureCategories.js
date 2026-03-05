// services/FurnitureCategories/getFurnitureCategories.js
import axios from "axios";
import config from "../../config.json";

async function getFurnitureCategories(signal) {
  const res = await axios.get(`${config.apiFurnitureCategories}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  // El backend devuelve un array plano
  return res.data;
}

export { getFurnitureCategories };
