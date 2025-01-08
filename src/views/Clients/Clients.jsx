import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllClientsList, deleteClient } from "../../index.js";

function Clients() {
  const [clients, setClients] = useState([]);
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50; // Límite de clientes por página

  const getClientsToSet = (term = "", page = 1) => {
    setLoader(true);
    getAllClientsList(term, page, itemsPerPage)
      .then((clientsData) => {
        setClients(clientsData.clients);
        setCurrentPage(clientsData.currentPage);
        setTotalPages(clientsData.totalPages);
        setLoader(false);
        setSearchLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
        setLoader(false);
        setSearchLoader(false);
      });
  };

  //traer los clientes
  useEffect(() => {
    getClientsToSet(searchTerm, currentPage);
  }, [currentPage]);

  // Manejar la búsqueda de clientes
  const handleSearch = debounce((term) => {
    setCurrentPage(1); // Restablece la página a 1 al buscar
    getClientsToSet(term, 1); // Filtra desde la primera página
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
      getClientsToSet(searchTerm, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getClientsToSet(searchTerm, currentPage + 1);
    }
  };

  //Eliminar cliente
  function handleDeleteClient(clientId) {
    setOpenModalToDelete(true);
    setClientToDelete(clientId);
  }

  function deleteSingleClient(clientId) {
    deleteClient(clientId)
      .then((res) => {
        getClientsToSet(searchTerm, currentPage);
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setClientToDelete(null);
  }

  return (
    <>
      <div>
        <div className="flex gap-4 items-center p-8">
          <h1 className="text-4xl">Clientes</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-cliente"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Cliente
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
                  Apellido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Teléfono
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  DNI
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  CUIT/CUIL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Dirección
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
              {clients.slice().map((client) => (
                <tr key={client._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.cuil_cuit}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <Link
                        to={`/editar-cliente/${client._id}`}
                        className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                      >
                        Editar
                      </Link>
                      <button
                        className="text-white bg-red-500 rounded-md px-2 py-1 mb-2"
                        onClick={() => handleDeleteClient(client._id)}
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
        {/* Controles de Paginación */}
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
      ${
        currentPage === 1
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
          >
            Anterior
          </button>
          <span className="text-lg font-medium">
            Página <span>{currentPage}</span> de <span>{totalPages}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
      ${
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
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el insumo?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleClient(clientToDelete)}
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

export { Clients };
