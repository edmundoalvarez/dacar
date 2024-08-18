import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS MODULOS CREADOS
async function getPiecesByFurnitureId(id) {
  const res = await axios.get(
    `${config.apiFurnitures}/find-furniture-pieces/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { getPiecesByFurnitureId };
