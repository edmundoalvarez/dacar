import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import {
    getFurnitureById,
    EditFurnitureSingleModuleComponent,
    EditFurnitureComponent,
    deleteModuleOnFurniture,
    ViewModulesFurniture,
    getPiecesByModuleId,
} from "../../index.js";

function EditFurnitureMultipleModules() {
    const [singleFurniture, setSingleFurniture] = useState([]);
    const [loader, setLoader] = useState(true);
    const [selectedModule, setSelectedModule] = useState(null);
    const [furnitureToEdit, setFurnitureToEdit] = useState(null);
    const [moduleToEdit, setModuleToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //eliminar modulo
    const [openModalToDeleteModule, setOpenModalToDeleteModule] =
        useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    const navigate = useNavigate();
    const { idFurniture } = useParams();

    const getFurnituresToSet = () => {
        getFurnitureById(idFurniture)
            .then((furnituresData) => {
                setSingleFurniture(furnituresData.data);
                setLoader(false);
            })
            .catch((error) => {
                console.error("Este es el error:", error);
            });
    };

    useEffect(() => {
        getFurnituresToSet();
    }, []);

    // Handle modal for viewing module details
    const handleOpenModal = async (module) => {
        console.log(module);
        try {
            // Envuelve el módulo en un array y establece 'selectedModules'
            setSelectedModule([module]);

            // Abre la modal
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error al obtener las piezas del módulo:", error);
        }
    };
    const handleCloseModal = () => {
        setSelectedModule(null);
        setIsModalOpen(false);
    };

    // Handle editing a module
    const handleEditModule = (singleFurniture, module) => {
        setFurnitureToEdit(singleFurniture);
        setModuleToEdit(module);
    };

    // Handle editing a furniture
    const handleEditFurniture = (singleFurniture) => {
        setFurnitureToEdit(singleFurniture);
    };

    //Cuando el modulo es modificado y se desrenderice
    const handleModification = () => {
        setModuleToEdit(null);
        setFurnitureToEdit(null);
        getFurnituresToSet();
    };
    const closeComponentEdit = () => {
        setModuleToEdit(null);
        setFurnitureToEdit(null);
    };

    //eliminar modulo
    function handleDeleteModule(furnitureId, moduleId) {
        setOpenModalToDeleteModule(true);
        setModuleToDelete({ furnitureId, moduleId });
    }
    function deleteSingleModule(furnitureIdmoduleId) {
        // console.log("furnitureIdmoduleId", furnitureIdmoduleId);
        let furnitureId = furnitureIdmoduleId.furnitureId;
        let moduleId = furnitureIdmoduleId.moduleId;
        deleteModuleOnFurniture(furnitureId, moduleId)
            .then((res) => {
                getFurnituresToSet();
                console.log(res.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Cerrar la modal después de eliminar el modulo
        setOpenModalToDeleteModule(false);
        setModuleToDelete(null);
    }

    return (
        <div className="pb-8 px-16 bg-gray-100 min-h-screen">
            <div>
                <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
                    <h1 className="text-4xl font-semibold text-white">
                        Mueble: {singleFurniture.name}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/ver-muebles`}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
                        >
                            <img
                                src="./../icon_back.svg"
                                alt="Icono de budgets"
                                className="w-[18px]"
                            />
                            <p className="m-0 leading-loose">Volver</p>
                        </Link>
                        <Link
                            to="/"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
                        >
                            <img
                                src="./../icon_home.svg"
                                alt="Icono de budgets"
                                className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">Ir a Inicio</p>
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto mt-4">
                    <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
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
                                        Alto
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                                    >
                                        Profundidad
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                                    >
                                        Categoría
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                                    >
                                        Editar Mueble
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr key={singleFurniture._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {singleFurniture.name}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {singleFurniture.length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {singleFurniture.height}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {singleFurniture.width}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {singleFurniture.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() =>
                                                handleEditFurniture(
                                                    singleFurniture._id
                                                )
                                            }
                                            className="w-1/2 text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                                        >
                                            <img
                                                src="./../icon_edit.svg"
                                                alt="Icono de budgets"
                                                className="w-[20px]"
                                            />
                                            <p className="m-0 leading-loose">
                                                Editar
                                            </p>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
                        <Grid
                            visible={loader}
                            height="80"
                            width="80"
                            s
                            color="rgb(92, 92, 92)"
                            ariaLabel="grid-loading"
                            radius="12.5"
                            wrapperStyle={{}}
                            wrapperClass="grid-wrapper"
                        />
                    </div>
                    {/* modulos */}

                    <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white p-6">
                        <h2 className="text-2xl font-semibold mb-4">Modulos</h2>
                        {Array.isArray(singleFurniture.modules_furniture) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                                {singleFurniture.modules_furniture
                                    .slice()
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    ) // Ordena alfabéticamente
                                    .map((module, index) => (
                                        <div
                                            key={module._id || index}
                                            className="rounded-lg p-4 flex flex-col items-start bg-white shadow border-2 border-emerald-500"
                                        >
                                            <p className="mb-2 font-bold text-md text-black">
                                                {module.name}
                                            </p>
                                            <div className="mt-auto flex gap-2 w-full">
                                                <button
                                                    className="w-1/3 text-white bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                                                    onClick={() =>
                                                        handleOpenModal(module)
                                                    }
                                                >
                                                    <img
                                                        src="./../icon_search.svg"
                                                        alt="Icono de budgets"
                                                        className="w-[18px]"
                                                    />
                                                    <p className="m-0 leading-loose">
                                                        Ver
                                                    </p>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleEditModule(
                                                            singleFurniture._id,
                                                            module._id
                                                        )
                                                    }
                                                    className="w-1/3 text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                                                >
                                                    <img
                                                        src="./../icon_edit.svg"
                                                        alt="Icono de budgets"
                                                        className="w-[18px]"
                                                    />
                                                    <p className="m-0 leading-loose">
                                                        Editar
                                                    </p>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteModule(
                                                            singleFurniture._id,
                                                            module._id
                                                        )
                                                    }
                                                    className="w-1/3 text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                                                >
                                                    <img
                                                        src="./../icon_delete.svg"
                                                        alt="Icono de budgets"
                                                        className="w-[16px]"
                                                    />
                                                    <p className="m-0 leading-loose">
                                                        Eliminar
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* fin modulos */}
                </div>
            </div>
            {/* modal de desea eliminar el modulo */}
            {openModalToDeleteModule && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
                        <h2 className="text-xl mb-4">
                            ¿Seguro que desea eliminar la pieza?
                        </h2>
                        <div className="flex gap-4">
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded"
                                onClick={() =>
                                    deleteSingleModule(moduleToDelete)
                                }
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-300 text-black py-2 px-4 rounded"
                                onClick={() =>
                                    setOpenModalToDeleteModule(false)
                                }
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Abrimos la modal en caso que el estado isModalOpen cambie */}
            {isModalOpen && (
                <div
                    onClick={handleCloseModal} // Cierra la modal si se hace clic fuera de ella
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal la cierre
                        className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-[550px] overflow-y-auto relative m-8"
                    >
                        {/* Botón de cierre en la esquina superior derecha */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
                        >
                            &times;
                        </button>

                        {/* Contenido de la modal */}
                        <ViewModulesFurniture sortedModules={selectedModule} />

                        <div className="flex justify-center items-center m-auto gap-2 mt-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {moduleToEdit && (
                <EditFurnitureSingleModuleComponent
                    idFurniture={furnitureToEdit}
                    idModule={moduleToEdit}
                    onModified={handleModification}
                    notModified={closeComponentEdit}
                />
            )}

            {furnitureToEdit && !moduleToEdit && (
                <EditFurnitureComponent
                    idFurniture={furnitureToEdit}
                    onModified={handleModification}
                    notModified={closeComponentEdit}
                />
            )}
        </div>
    );
}

export { EditFurnitureMultipleModules };
