import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//TRAER TODAS LA PIEZA
async function updatePiece(moduleId, updatedPiece) {
  const res = await axios.put(
    `${config.apiPieces}/edit-piece/${moduleId}`,
    updatedPiece,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { updatePiece };
