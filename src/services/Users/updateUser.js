// services/users.js
// ACTUALIZAR USUARIO
import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

async function updateUser(userId, updatedUser) {
  const token = Cookies.get("token"); // 👈 lo guardaste en el login

  const res = await axios.put(`${config.apiUsers}/${userId}`, updatedUser, {
    headers: {
      "Content-Type": "application/json",
      auth: token, // 👈 este header lo lee tu middleware auth
    },
  });

  return token;
}

export { updateUser };
