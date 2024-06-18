import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie"; */
/* const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//CREAR MODULO CON SUS PIEZAS
async function createPieces(data) {
  const res = await axios.post(
    config.apiPieces,
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

export { createPieces };
