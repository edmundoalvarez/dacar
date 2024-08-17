import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllBudgets, filterBudgetByClientName } from "../../index.js";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  const getAllBudgetsToSet = () => {
    getAllBudgets()
      .then((budgetsData) => {
        setBudgets(budgetsData.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  // Manejar la búsqueda de presupuestos
  const handleSearch = debounce((term) => {
    if (term.trim() !== "") {
      filterBudgetByClientName(term)
        .then((res) => {
          setBudgets(res.data);
          setLoader(false);
          setSearchLoader(false);
        })
        .catch((error) => {
          setSearchLoader(true);
          console.error("Error al filtrar los presupuestos:", error);
        });
    } else {
      getAllBudgetsToSet();
      setSearchLoader(false);
    }
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setLoader(true);
    setSearchLoader(true);
    handleSearch(e.target.value);
  };

  useEffect(() => {
    getAllBudgetsToSet();
  }, []);

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl">Presupuestos</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre de cliente"
              className="border p-2 rounded-lg ml-auto w-64"
            />

            <Oval
              visible={searchLoader}
              height="30"
              width="30"
              color="rgb(92, 92, 92)"
              secondaryColor="rgb(92, 92, 92)"
              strokeWidth="6"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Número
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Nombre del mueble
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.map((budget) => (
                <tr key={budget._id} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.budget_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(budget.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.client.map((client) => (
                      <div key={client._id}>
                        {client.name} {client.lastname}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {budget.furniture_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/ver-presupuestos/${budget._id}`}
                      className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-700"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center w-full mt-8">
            <Grid
              visible={loader}
              height="80"
              width="80"
              color="rgb(92, 92, 92)"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass="grid-wrapper"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export { Budgets };
