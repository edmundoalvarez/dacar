import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie"; */
/* const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//CREAR MODULO CON SUS PIEZAS
async function createModule(data) {
  const res = await axios.post(
    config.apiModules,
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
  return res.data.module._id;
}

export { createModule };
