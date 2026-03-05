import axios from "axios";
import config from "../../config.json";

// CREAR USUARIO
async function createUser(data) {
  const { username, name, lastname, email, password, role } = data;

  const payload = {
    username,
    email,
    password,
    role, // "1" o "2"
    name,
    lastname,
  };

  const res = await axios.post(config.apiUsers, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

export { createUser };
