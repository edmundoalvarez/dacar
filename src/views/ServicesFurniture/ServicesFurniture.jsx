import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllServicesList, deleteService } from "../../index.js";

function ServicesFurniture() {
    const [services, setServices] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLoader, setSearchLoader] = useState(false);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 50;

    const getServicesToSet = (term = "", page = 1) => {
        setLoader(true);
        getAllServicesList(term, page, itemsPerPage)
            .then((servicesData) => {
                setServices(servicesData.services);
                setCurrentPage(servicesData.currentPage);
                setTotalPages(servicesData.totalPages);
                setLoader(false);
                setSearchLoader(false);
            })
            .catch((error) => {
                console.error("Este es el error:", error);
            });
    };

    //traer los servicios
    useEffect(() => {
        getServicesToSet(searchTerm, currentPage);
    }, [currentPage]);

    // Manejar la búsqueda de servicios
    const handleSearch = debounce((term) => {
        setCurrentPage(1); // Restablece la página a 1 al buscar
        getServicesToSet(term, 1); // Filtra desde la primera página
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
            getServicesToSet(searchTerm, currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            getServicesToSet(searchTerm, currentPage + 1);
        }
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
                getServicesToSet(searchTerm, currentPage);
                // console.log(res.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Cerrar la modal después de eliminar la pieza
        setOpenModalToDelete(false);
        setServiceToDelete(null);
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
            <div className="pb-8 px-16 bg-gray-100 min-h-screen">
                <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
                    <h1 className="text-4xl font-semibold text-white">
                        Servicios
                    </h1>
                    {/* Campo de búsqueda */}
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
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
                        >
                            <img
                                src="./icon_back.svg"
                                alt="Icono de budgets"
                                className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">
                                Volver al Inicio
                            </p>
                        </Link>
                        <Link
                            to="/crear-servicio"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
                        >
                            <img
                                src="./icon_add.svg"
                                alt="Icono de budgets"
                                className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">Crear Servicio</p>
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto mt-4">
                    {/* Table */}
                    <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {services.slice().map((service) => (
                                    <tr
                                        key={service.name}
                                        className="hover:bg-gray-100 transition duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(service.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/editar-servicio/${service._id}`}
                                                    className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                                                >
                                                    <img
                                                        src="./../icon_edit.svg"
                                                        alt="Icono de budgets"
                                                        className="w-[20px]"
                                                    />
                                                    <p className="m-0 leading-loose">
                                                        Editar
                                                    </p>
                                                </Link>
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
                                wrapperStyle={{}}
                                wrapperClass="grid-wrapper"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-4 py-8 text-black">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
                        ${
                            currentPage === 1
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-700"
                        }`}
                    >
                        Anterior
                    </button>
                    <span className="text-lg font-medium">
                        Página <span>{currentPage}</span> de{" "}
                        <span>{totalPages}</span>
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
                        ${
                            currentPage === totalPages
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-700"
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
                            ¿Seguro que desea eliminar el servicio? <br></br>{" "}
                            Esto puede generar que errores al presupuestar.
                        </h2>
                        <div className="flex gap-4">
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded"
                                onClick={() =>
                                    deleteSingleService(serviceToDelete)
                                }
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
