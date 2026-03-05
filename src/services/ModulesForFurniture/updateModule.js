import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//TRAER TODAS LOS MODULOS CREADOS
async function updateModule(moduleId, updatedModule) {
  const token = Cookies.get("token");
  const res = await axios.put(
    `${config.apiModules}/edit-module/${moduleId}`,
    updatedModule,
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { updateModule };
