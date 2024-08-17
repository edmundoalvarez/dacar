import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import {
  getAllServices,
  deleteService,
  filterServiceByName,
} from "../../index.js";

function ServicesFurniture() {
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  const getServicesToSet = () => {
    getAllServices()
      .then((servicesData) => {
        setServices(servicesData.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  //traer los servicios
  useEffect(() => {
    getServicesToSet();
  }, []);

  // Manejar la búsqueda de servicios
  const handleSearch = debounce((term) => {
    if (term.trim() !== "") {
      filterServiceByName(term)
        .then((res) => {
          setServices(res.data);
          setLoader(false);
          setSearchLoader(false);
        })
        .catch((error) => {
          setSearchLoader(true);
          console.error("Error al filtrar los servicios:", error);
        });
    } else {
      getServicesToSet();
      setSearchLoader(false); // Si no hay término de búsqueda, obtener todos los servicios
    }
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setLoader(true);
    setSearchLoader(true);
    handleSearch(e.target.value);
  };

  //Eliminar servicio
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  function handleDeleteService(serviceId) {
    setOpenModalToDelete(true);
    setServiceToDelete(serviceId);
  }

  function deleteSingleService(serviceId) {
    deleteService(serviceId)
      .then((res) => {
        getServicesToSet();
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setServiceToDelete(null);
  }
  return (
    <>
      <div className="m-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl">Servicios</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-servicio"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Servicio
          </Link>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border p-2 rounded-lg ml-auto"
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
                  Precio
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
              {services
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                .map((service) => (
                  <tr key={service.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${service.price}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Link
                          to={`/editar-servicio/${service._id}`}
                          className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                        >
                          Editar
                        </Link>
                        <button
                          className="text-white bg-red-500 rounded-md px-2 py-1 mb-2"
                          onClick={() => handleDeleteService(service._id)}
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
              ¿Seguro que desea eliminar el servicio?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleService(serviceToDelete)}
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

export { ServicesFurniture };
