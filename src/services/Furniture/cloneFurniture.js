import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config.json";

async function cloneFurniture(furnitureId) {
  const token = Cookies.get("token");
  const res = await axios.post(
    `${config.apiFurnitures}/clone/${furnitureId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { cloneFurniture };
