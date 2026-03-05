import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

export async function getFurnitureHistory(furnitureId, signal) {
  const token = Cookies.get("token");

  const res = await axios.get(
    `${config.apiFurnitures}/${furnitureId}/history`,
    {
      signal,
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );

  return res.data.data; // [logs]
}
