import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import {
  getAllSupplies,
  deleteSupplie,
  filterSupplieByName,
} from "../../index.js";

function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  const getSuppliesToSet = () => {
    getAllSupplies()
      .then((suppliesData) => {
        setSupplies(suppliesData.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  //traer los insumo
  useEffect(() => {
    getSuppliesToSet();
  }, []);

  // Manejar la búsqueda de insumos
  const handleSearch = debounce((term) => {
    if (term.trim() !== "") {
      filterSupplieByName(term)
        .then((res) => {
          setSupplies(res.data);
          setLoader(false);
          setSearchLoader(false);
        })
        .catch((error) => {
          setSearchLoader(true);
          console.error("Error al filtrar los insumos:", error);
        });
    } else {
      getSuppliesToSet();
      setSearchLoader(false); // Si no hay término de búsqueda, obtener todos los insumos
    }
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setLoader(true);
    setSearchLoader(true);
    handleSearch(e.target.value);
  };

  //Eliminar insumo
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [supplieToDelete, setSupplieToDelete] = useState(null);

  function handleDeleteSupplie(supplieId) {
    setOpenModalToDelete(true);
    setSupplieToDelete(supplieId);
  }

  function deleteSingleSupplie(supplieId) {
    deleteSupplie(supplieId)
      .then((res) => {
        getSuppliesToSet();
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setSupplieToDelete(null);
  }
  return (
    <>
      <div>
        <div className="flex gap-4 items-center p-8">
          <h1 className="text-4xl">Insumos</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-insumo"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Insumo
          </Link>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border border-gray-400 p-2 rounded-lg ml-auto"
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
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Largo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Ancho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Grosor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Material
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Precio
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Proveedor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {supplies
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                .map((supplie) => (
                  <tr key={supplie.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.width}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.thickness}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${supplie.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplie.supplier_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Link
                          to={`/editar-insumo/${supplie._id}`}
                          className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                        >
                          Editar
                        </Link>
                        <button
                          className="text-white bg-red-500 rounded-md px-2 py-1 mb-2"
                          onClick={() => handleDeleteSupplie(supplie._id)}
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
                onClick={() => deleteSingleSupplie(supplieToDelete)}
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

export { Supplies };
