import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllSupplies, deleteSupplie } from "../../index.js";

function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50; // Límite de insumos por página

  const getSuppliesToSet = (term = "", page = 1) => {
    setLoader(true);
    getAllSupplies(term, page, itemsPerPage)
      .then((response) => {
        setSupplies(response.supplies);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setLoader(false);
        setSearchLoader(false);
      })
      .catch((error) => {
        console.error("Error al obtener los insumos:", error);
        setLoader(false);
        setSearchLoader(false);
      });
  };
  //traer los insumo
  useEffect(() => {
    getSuppliesToSet(searchTerm, currentPage);
  }, [currentPage]);

  const handleSearch = debounce((term) => {
    setCurrentPage(1); // Restablece la página a 1 al buscar
    getSuppliesToSet(term, 1); // Filtra desde la primera página
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    handleSearch(term);
  };

  // Controladores de cambio de página
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getSuppliesToSet(searchTerm, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getSuppliesToSet(searchTerm, currentPage + 1);
    }
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
        getSuppliesToSet(searchTerm, currentPage);
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setSupplieToDelete(null);
  }
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <div className="py-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Insumos</h1>
          <div className="flex gap-3">
            <Link
              to="/"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
            >
              Volver al Inicio
            </Link>
            <Link
              to="/crear-insumo"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
            >
              Crear Insumo
            </Link>
          </div>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border border-gray-300 p-2 rounded-lg ml-auto shadow-md "
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
          <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
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
                {supplies.slice().map((supplie) => (
                  <tr
                    key={supplie.name}
                    className="hover:bg-gray-100 transition duration-150"
                  >
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
                      {formatCurrency(supplie.price)}
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
          </div>
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
        {/* Controles de Paginación */}

        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Anterior
          </button>
          <span className="text-lg font-medium text-gray-700">
            Página <span className="font-bold">{currentPage}</span> de{" "}
            <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl text-center mb-4">
              ¿Seguro que desea eliminar el insumo? <br></br> Esto puede generar
              que errores al presupuestar.
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
