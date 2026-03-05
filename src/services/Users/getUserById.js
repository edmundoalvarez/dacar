import axios from "axios";
import config from "../../config.json";

async function getUserById(userId) {
  const res = await axios.get(`${config.apiUsers}/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export { getUserById };
