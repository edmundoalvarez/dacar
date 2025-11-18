import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllClientsList, deleteClient } from "../../index.js";

function Clients() {
  const ENV = import.meta.env.VITE_ENV;

  const [clients, setClients] = useState([]);
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [loader, setLoader] = useState(true); // loader general
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false); // loader de búsqueda

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // AbortController + sequence id
  const controllerRef = useRef(null);
  const reqSeqRef = useRef(0);

  const getClientsToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      // cancelar request previa
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current; // id de esta request

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllClientsList(
          term,
          page,
          itemsPerPage,
          controller.signal
        );
        // si se canceló o llegó fuera de orden, no actualizar
        if (!data || seq !== reqSeqRef.current) return;

        setClients(data.clients);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (_) {
        // si no fue cancelación, el service ya lo loguea
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  // Carga inicial + cambio de página conservando el término
  useEffect(() => {
    getClientsToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, searchTerm, getClientsToSet]);

  // Debounce estable para búsqueda
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        getClientsToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getClientsToSet]
  );

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);

  // Input búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term);
  };

  // Paginación manteniendo término actual
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getClientsToSet(searchTerm, currentPage - 1, { showMainLoader: true });
      setCurrentPage((p) => p - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getClientsToSet(searchTerm, currentPage + 1, { showMainLoader: true });
      setCurrentPage((p) => p + 1);
    }
  };

  // Eliminar cliente
  function handleDeleteClient(clientId) {
    setOpenModalToDelete(true);
    setClientToDelete(clientId);
  }
  function deleteSingleClient(clientId) {
    deleteClient(clientId)
      .then(() => {
        getClientsToSet(searchTerm, currentPage, { showMainLoader: true });
      })
      .catch((error) => console.error(error));

    setOpenModalToDelete(false);
    setClientToDelete(null);
  }

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Clientes</h1>

          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border border-gray-300 p-2 rounded-lg ml-auto shadow-md w-[400px]"
            />
            <Oval
              visible={searchLoader}
              height="30"
              width="30"
              color="rgb(92, 92, 92)"
              secondaryColor="rgb(92, 92, 92)"
              strokeWidth="6"
              ariaLabel="oval-loading"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_back.svg" alt="Volver" className="w-[20px]" />
              <p className="m-0 leading-loose">Volver al Inicio</p>
            </Link>
            <Link
              to="/crear-cliente"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img src="./icon_add.svg" alt="Crear" className="w-[20px]" />
              <p className="m-0 leading-loose">Crear Cliente</p>
            </Link>
          </div>
        </div>

        {ENV === "TEST" && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
            ⚠️ Estás en entorno de pruebas (TEST)
          </div>
        )}

        <div className="overflow-x-auto mt-4">
          <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    CUIT/CUIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
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
                          className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_edit.svg"
                            alt="Editar"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Editar</p>
                        </Link>
                        <button
                          onClick={() => handleDeleteClient(client._id)}
                          className="text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_delete.svg"
                            alt="Eliminar"
                            className="w-[18px]"
                          />
                          <p className="m-0 leading-loose">Eliminar</p>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
              <Grid
                visible={loader}
                height="80"
                width="80"
                color="rgb(92, 92, 92)"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="grid-wrapper"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 py-8 text-black">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
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
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal eliminar */}
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el cliente?
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
