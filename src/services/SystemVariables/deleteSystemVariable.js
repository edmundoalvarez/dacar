import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config.json";

async function deleteSystemVariable(id) {
  const token = Cookies.get("token");
  const res = await axios.delete(`${config.apiSystemVariables}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });

  return res.data;
}

export { deleteSystemVariable };
