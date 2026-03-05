import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

//ELIMINAR UNA PIEZA
async function deleteOriginalModule(moduleId) {
  const token = Cookies.get("token");

  const res = await axios.delete(
    `${config.apiModules}/delete-module/${moduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );
  return res;
}

export { deleteOriginalModule };
