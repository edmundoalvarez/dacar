import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices, deleteService } from "../../index.js";

function ServicesFurniture() {
  const [services, setServices] = useState([]);

  const getServicesToSet = () => {
    getAllServices()
      .then((servicesData) => {
        setServices(servicesData.data);
        // console.log(servicesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  //traer los servicios
  useEffect(() => {
    getServicesToSet();
  }, []);

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
        <div className="flex gap-4">
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
