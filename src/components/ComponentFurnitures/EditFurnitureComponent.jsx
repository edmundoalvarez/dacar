import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    getAllModules,
    getFurnitureById,
    getPiecesByModuleId,
    updateFurniture,
} from "../../index.js";

function EditFurnitureComponent({ idFurniture, onModified, notModified }) {
    const [originalFurnitureModules, setOriginalFurnitureModules] = useState(
        []
    );
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [selectedModule, setSelectedModule] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModuleIds, setSelectedModuleIds] = useState([]);
    const [moduleQuantities, setModuleQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const getFurnitureData = () => {
        if (!idFurniture) {
            console.error("idFurniture is undefined");
            return;
        }

        getFurnitureById(idFurniture).then((furnitureData) => {
            const furniture = furnitureData.data;
            setOriginalFurnitureModules(furniture.modules_furniture);
            setValue("name", furniture.name);
            setValue("height", furniture.height);
            setValue("length", furniture.length);
            setValue("width", furniture.width);
            setValue("category", furniture.category);
        });
    };

    const handleOpenModal = (module) => {
        setSelectedModule(module);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate();

    const getAllModulesToSet = () => {
        getAllModules()
            .then((modulesData) => {
                setModules(modulesData.data);
                // console.log(modulesData.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleModuleChange = (e) => {
        const { value, checked } = e.target;
        const selectedModule = modules.find((module) => module._id === value);
        setSelectedModules((prev) =>
            checked
                ? [...prev, selectedModule]
                : prev.filter((module) => module._id !== value)
        );
        setSelectedModuleIds((prev) =>
            checked ? [...prev, value] : prev.filter((id) => id !== value)
        );
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                [selectedModule._id]: { ...selectedModule },
            }));
            setOriginalData((prev) => ({
                ...prev,
                [selectedModule._id]: { ...selectedModule },
            }));
        } else {
            setFormData((prev) => {
                const newFormData = { ...prev };
                delete newFormData[selectedModule._id];
                return newFormData;
            });
            setOriginalData((prev) => {
                const newOriginalData = { ...prev };
                delete newOriginalData[selectedModule._id];
                return newOriginalData;
            });
        }
    };

    const handleInputChange = (moduleId, value) => {
        setModuleQuantities((prev) => ({
            ...prev,
            [moduleId]: parseInt(value, 10),
        }));
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();
        console.log("Data del form", data);
        console.log("selectedModules", selectedModules);
        console.log("moduleQuantities", moduleQuantities);
        console.log("originalFurnitureModules", originalFurnitureModules);
        try {
            const editedModules = await Promise.all(
                selectedModules.flatMap(async (module) => {
                    const moduleId = module._id;
                    const quantity = moduleQuantities[moduleId] || 1;
                    const modulePieces = await getPiecesByModuleId(moduleId);

                    const matchingModules = originalFurnitureModules.filter(
                        (originalModule) =>
                            originalModule._id.startsWith(moduleId) // Coincide por el prefijo
                    );

                    const newModules = Array.from(
                        { length: quantity },
                        (_, i) => {
                            const highestSuffix = matchingModules.reduce(
                                (max, mod) => {
                                    const suffix = parseInt(
                                        mod._id.split("-").pop(),
                                        10
                                    );
                                    return suffix > max ? suffix : max;
                                },
                                0
                            );

                            const newId = matchingModules.length
                                ? `${moduleId}-${highestSuffix + i + 1}`
                                : `${moduleId}-${i + 1}`;

                            return {
                                ...module,
                                ...formData[moduleId],
                                _id: newId,
                                name: `${formData[moduleId].name} (${
                                    highestSuffix + i + 1
                                })`,
                                pieces: modulePieces,
                            };
                        }
                    );

                    return newModules;
                })
            ).then((modules) => modules.flat());
            console.log("data", data, "editedModules", editedModules);
            const allModules = [...originalFurnitureModules, ...editedModules];
            console.log("allModules", allModules);
            await updateFurniture(idFurniture, {
                ...data,
                modules_furniture: allModules,
            }).then((res) => {
                // console.log("¡Mueble actualizado con éxito!");
                onModified();
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllModulesToSet();
        getFurnitureData();
    }, []);
    //Filtrar dentro de los modulos a elegir
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredModules = modules.filter((module) => {
        const term = searchTerm.toLowerCase();
        return (
            module.name.toLowerCase().includes(term) ||
            module.description.toLowerCase().includes(term)
        );
    });
    return (
        <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white p-6">
            <div className="flex flex-row justify-between gap-4">
                <h1 className="text-4xl font-semibold mb-4 text-black">
                    Editar Mueble
                </h1>
                <button
                    onClick={notModified}
                    className="px-4 max-h-10 rounded-md bg-red-600 text-light font-medium"
                >
                    Cerrar
                </button>
            </div>
            <form
                action=""
                className="w-full max-w-full m-auto p-12 rounded-lg bg-white shadow-sm"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex">
                    <div className="flex flex-col w-1/2">
                        <div className="flex flex-col w-11/12 my-2">
                            <label
                                htmlFor="name"
                                className="text-gray-700 font-medium"
                            >
                                Nombre del mueble
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                                type="text"
                                name="name"
                                id="name"
                                {...register("name", {
                                    required: "El campo es obligatorio",
                                })}
                            />
                            {errors.name && (
                                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col w-11/12 my-2">
                            <label
                                htmlFor="length"
                                className="text-gray-700 font-medium"
                            >
                                Largo
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                                type="text"
                                name="length"
                                id="length"
                                {...register("length", {
                                    required: "El campo es obligatorio",
                                })}
                            />
                            {errors.length && (
                                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                    {errors.length.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col w-11/12 my-2">
                            <label
                                htmlFor="height"
                                className="text-gray-700 font-medium"
                            >
                                Alto
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                                type="text"
                                name="height"
                                id="height"
                                {...register("height", {
                                    required: "El campo es obligatorio",
                                })}
                            />
                            {errors.height && (
                                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                    {errors.height.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col w-11/12 my-2">
                            <label
                                htmlFor="width"
                                className="text-gray-700 font-medium"
                            >
                                Profundidad
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                                type="text"
                                name="width"
                                id="width"
                                {...register("width", {
                                    required: "El campo es obligatorio",
                                })}
                            />
                            {errors.width && (
                                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                    {errors.width.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col w-11/12 my-2">
                            <label
                                htmlFor="category"
                                className="text-gray-700 font-medium"
                            >
                                Categoria
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                                type="text"
                                name="category"
                                id="category"
                                {...register("category", {
                                    required: "El campo es obligatorio",
                                })}
                            />
                            {errors.category && (
                                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                    {errors.category.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mb-6 w-1/2">
                        <label
                            htmlFor="modules"
                            className="block font-semibold text-lg text-gray-800 mb-2"
                        >
                            Agregar Módulos
                        </label>
                        {/* Campo de búsqueda */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Buscar por nombre o descripción"
                            className="border border-gray-300 rounded-md px-4 py-2 mt-1 mb-6 focus:border-emerald-500 w-full"
                        />
                        <div className="border border-gray-300 rounded-lg overflow-y-auto max-h-80">
                            <table className="min-w-full">
                                <thead className="bg-gray-200 sticky top-0 text-gray-600 text-sm font-medium">
                                    <tr>
                                        {[
                                            "Seleccionar",
                                            "Nombre",
                                            "Descripción",
                                            "Cantidad",
                                        ].map((header, index) => (
                                            <th
                                                key={index}
                                                className="px-4 py-2 text-left"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModules.map((module) => (
                                        <tr
                                            key={module._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-2 border-t border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    id={`module-${module._id}`}
                                                    value={module._id}
                                                    onChange={
                                                        handleModuleChange
                                                    }
                                                    className="mr-2"
                                                    name={`module-${module._id}`}
                                                />
                                            </td>
                                            <td
                                                td
                                                className="px-4 py-2 border-t border-gray-200"
                                            >
                                                <label
                                                    className="font-medium"
                                                    htmlFor={`module-${module._id}`}
                                                >
                                                    {module.name}
                                                </label>
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 text-gray-700">
                                                {module.description}
                                            </td>
                                            <td className="px-4 py-2 border-t border-gray-200 text-center">
                                                {selectedModuleIds.includes(
                                                    module._id
                                                ) ? (
                                                    <input
                                                        className="border border-gray-300 bg-gray-100 rounded-md px-2 py-1 w-20 text-center"
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            moduleQuantities[
                                                                module._id
                                                            ] || 0
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                module._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.modules_furniture && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.modules_furniture.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Módulos Seleccionados:
                    </h2>
                    <div>
                        {selectedModules.flatMap((module, index) => (
                            <div
                                key={module._id + "-" + index}
                                className=" text-black border border-gray-300 rounded-md p-4 my-2 flex items-center justify-between bg-gray-50"
                            >
                                <p>{module.name}</p>
                                <p>{module.description}</p>
                                <button
                                    type="button"
                                    onClick={() => handleOpenModal(module)}
                                    className="ml-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Ver
                                </button>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && selectedModule && (
                        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-h-[660px] overflow-y-auto relative">
                                <h2 className="text-xl mb-4">
                                    <b>Detalles del Módulo</b>
                                </h2>
                                <div className="mb-2 w-full">
                                    <table className="w-full border-collapse border border-gray-400">
                                        <tbody>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2 text-left">
                                                    Nombre
                                                </th>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formData[
                                                        selectedModule._id
                                                    ]?.name || ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2 text-left">
                                                    Largo
                                                </th>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formData[
                                                        selectedModule._id
                                                    ]?.length || ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2 text-left">
                                                    Ancho
                                                </th>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formData[
                                                        selectedModule._id
                                                    ]?.width || ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2 text-left">
                                                    Alto
                                                </th>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formData[
                                                        selectedModule._id
                                                    ]?.height || ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2 text-left">
                                                    Cantidad de piezas
                                                </th>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formData[
                                                        selectedModule._id
                                                    ]?.pieces_number || ""}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-center items-center m-auto">
                                    <button
                                        onClick={handleCloseModal}
                                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full text-center">
                    <button
                        className="px-6 py-2 max-h-10 w-1/6 rounded-md bg-amber-500 text-light font-medium"
                        type="submit"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}

export { EditFurnitureComponent };
