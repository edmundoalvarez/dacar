import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ACTUALIZAR LA CANTIDAD DE PIEZAS DEL MODULO
async function updateModulePiecesNumber(moduleId, piecesNumber) {
  const res = await axios.patch(
    `${config.apiModules}/edit-module-pieces/${moduleId}`,
    { pieces_number: piecesNumber },
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { updateModulePiecesNumber };
