import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ELIMINAR UNA PIEZA
async function deletePiece(pieceId) {
  const res = await axios.delete(`${config.apiPieces}/${pieceId}`, {
    headers: {
      "Content-Type": "application/json",
      /*       auth: token, */
    },
  });
  return res;
}

export { deletePiece };
