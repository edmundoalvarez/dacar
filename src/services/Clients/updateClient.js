import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie";
const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//ACTUALIZAR CLIENTE
async function updateClient(clientId, updatedClient) {
  const res = await axios.put(
    `${config.apiClients}/edit-client/${clientId}`,
    updatedClient,
    {
      headers: {
        "Content-Type": "application/json",
        /*       auth: token, */
      },
    }
  );
  return res;
}

export { updateClient };
