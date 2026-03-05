import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//CREAR MUEBLE
async function createFurniture(data) {
  const token = Cookies.get("token");
  const res = await axios.post(
    config.apiFurnitures,
    {
      ...data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { createFurniture };
