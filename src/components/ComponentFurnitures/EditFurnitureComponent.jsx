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
                className="flex flex-wrap w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col w-4/12 my-2">
                    <label htmlFor="name">Nombre del mueble</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-11/12"
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
                <div className="flex flex-col w-2/12 my-2">
                    <label htmlFor="length">Largo</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-11/12"
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
                <div className="flex flex-col w-2/12 my-2">
                    <label htmlFor="height">Alto</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-11/12"
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
                <div className="flex flex-col w-2/12 my-2">
                    <label htmlFor="width">Profundidad</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-11/12"
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

                <div className="flex flex-col w-2/12 my-2">
                    <label htmlFor="category">Categoria</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-11/12"
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
                <div className="flex flex-col w-4/12 my-2">
                    <label htmlFor="modules">Agregar Módulos</label>
                    {/* Campo de búsqueda */}
                    <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre o descripción"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                    />
                    <div className="border border-gray-300 mb-2  p-2 rounded-md w-11/12 overflow-y-auto max-h-[400px]">
                        {filteredModules.map((module) => (
                            <div
                                key={module._id}
                                className="flex items-center p-2"
                            >
                                <input
                                    type="checkbox"
                                    id={`module-${module._id}`}
                                    value={module._id}
                                    onChange={handleModuleChange}
                                    className="mr-2"
                                    name={`module-${module._id}`}
                                />
                                <label htmlFor={`module-${module._id}`}>
                                    {module.name}
                                </label>
                                {selectedModuleIds.includes(module._id) && (
                                    <>
                                        <label
                                            htmlFor={`qty-module-${module._id}`}
                                        >
                                            Cantidad
                                        </label>
                                        <input
                                            className="border-solid border-2 border-opacity ml-2 rounded-md w-1/12"
                                            type="number"
                                            name={`qty-module-${module._id}`}
                                            min="1"
                                            value={
                                                moduleQuantities[module._id] ||
                                                0
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    module._id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.modules_furniture && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.modules_furniture.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col flex-wrap w-8/12 my-2">
                    <h2 className="text-2xl">Módulos Seleccionados:</h2>
                    <div>
                        {selectedModules.flatMap((module, index) => (
                            <div
                                key={module._id + "-" + index}
                                className=" text-black border border-gray-300 rounded-md p-4 my-2 flex items-center justify-between bg-gray-50"
                            >
                                <p>{module.name}</p>
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
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white p-10 rounded-lg shadow-lg flex justify-start items-start gap-3 flex-col">
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
                <div className="w-full">
                    <button
                        className="bg-amber-500 hover:bg-amber-700 text-white px-8 py-2 rounded-lg text-xl font-medium transition duration-300 w-1/6"
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
