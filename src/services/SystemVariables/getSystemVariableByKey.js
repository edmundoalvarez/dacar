import axios from "axios";
import config from "../../config.json";

async function getSystemVariableByKey(key, signal) {
  const res = await axios.get(
    `${config.apiSystemVariables}/public/${encodeURIComponent(key)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    }
  );

  return res.data;
}

export { getSystemVariableByKey };
