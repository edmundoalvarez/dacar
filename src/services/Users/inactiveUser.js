import axios from "axios";
import config from "../../config.json";

// INACTIVAR USUARIO (status = false)
async function inactiveUser(userId) {
  const res = await axios.patch(
    `${config.apiUsers}/${userId}/inactive`,
    { status: false }, // opcional, el backend igual puede fijarlo
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}

export { inactiveUser };
