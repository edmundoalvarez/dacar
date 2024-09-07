import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import {
  getAllBudgets,
  filterBudgetByClientName,
  deleteBudget,
} from "../../index.js";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
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

  //Eliminar presupuesto
  function handleDeleteBudget(budgetId) {
    setOpenModalToDelete(true);
    setBudgetToDelete(budgetId);
  }

  function deleteSingleBudget(budgetId) {
    deleteBudget(budgetId)
      .then((res) => {
        getAllBudgetsToSet();
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setBudgetToDelete(null);
  }

  return (
    <>
      <div>
        <div className="flex gap-4 items-center p-8">
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
              className="border border-gray-400 p-2 rounded-lg ml-auto w-64"
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
                    <div className=" flex justify-center gap-4">
                      <Link
                        to={`/ver-presupuestos/${budget._id}`}
                        className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-700"
                      >
                        Ver detalle
                      </Link>
                      <Link
                        to={`/editar-presupuestos/${budget._id}`}
                        className="text-white bg-orange hover:bg-amber-600 rounded-md px-2 py-2 text-center "
                      >
                        Editar
                      </Link>

                      <button
                        className="text-white bg-red-500 hover:bg-red-600 rounded-md px-2 py-1 text-center "
                        onClick={() => handleDeleteBudget(budget._id)}
                      >
                        Eliminar
                      </button>
                    </div>
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
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el insumo?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleBudget(budgetToDelete)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => setOpenModalToDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Budgets };
