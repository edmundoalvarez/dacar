import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LOS MODULOS CREADOS
async function getModuleAndPiecesByModuleId(moduleId) {
  const res = await axios.get(
    `${config.apiPieces}/find-module-and-pieces-by-moduleId/${moduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res.data;
}

export { getModuleAndPiecesByModuleId };
