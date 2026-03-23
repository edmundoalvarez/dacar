import axios from "axios";
import config from "../../config.json";

async function getFurnitureWithBudgetCalcs(id) {
  const res = await axios.get(`${config.apiFurnitures}/budget-calculations/${id}`);
  return res;
}

export { getFurnitureWithBudgetCalcs };
