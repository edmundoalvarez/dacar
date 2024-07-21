import axios from "axios";
import config from "../../config.json";
/* import Cookies from "js-cookie"; */
/* const token = Cookies.get("token");
const userId = Cookies.get("userId"); */

//CREAR CLIENTE
async function createClient(data) {
  const {
    client_name,
    client_lastname,
    dni,
    cuil_cuit,
    address,
    email,
    phone,
  } = data;
  const dataClient = {
    name: client_name,
    lastname: client_lastname,
    dni,
    cuil_cuit,
    address,
    email,
    phone,
  };
  const res = await axios.post(
    config.apiClients,
    {
      ...dataClient,
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

export { createClient };
