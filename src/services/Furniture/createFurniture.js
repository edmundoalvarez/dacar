import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie"; */
/* const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//CREAR MUEBLE
async function createFurniture(data) {
  const res = await axios.post(
    config.apiFurnitures,
    {
      ...data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        /* auth: token, */
      },
    }
  );
  return res;
}

export { createFurniture };
