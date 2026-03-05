import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

async function getConfirmedBudgets(
  searchTerm = "",
  page = 1,
  limit = 50,
  dateFrom = "",
  dateTo = ""
) {
  const token = Cookies.get("token");

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (searchTerm) params.set("search", searchTerm);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  const res = await axios.get(
    `${config.apiBudgets}/confirmed?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    }
  );

  return res.data; // <- clave
}

export { getConfirmedBudgets };
