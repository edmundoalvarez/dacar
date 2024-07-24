import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createFurniture,
  getAllModules,
  getFurnitureById,
  getPiecesByModuleId,
} from "../../index.js";

function EditFurnitureComponent({ idFurniture, onModified, notModified }) {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [moduleQuantities, setModuleQuantities] = useState({});
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
      console.log("furniture", furniture);

      setValue("name", furnitureData.data.name);
      setValue("height", furnitureData.data.height);
      setValue("length", furnitureData.data.length);
      setValue("width", furnitureData.data.width);
      setValue("category", furnitureData.data.category);
      furniture.modules_furniture.forEach((element) => {
        setValue(`module-${element._id}`, true); // Establece los checkboxes marcados
        setSelectedModuleIds((prev) => [...prev, element._id]);
      });
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
        console.log(modulesData.data);
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

    try {
      const editedModules = await Promise.all(
        selectedModules.flatMap(async (module) => {
          const moduleId = module._id;
          const quantity = moduleQuantities[moduleId] || 1;
          const modulePieces = await getPiecesByModuleId(moduleId);
          const isEdited =
            JSON.stringify(formData[moduleId]) !==
            JSON.stringify(originalData[moduleId]);

          const newModules = Array.from({ length: quantity }, (_, i) => ({
            ...module,
            ...formData[moduleId],
            _id: `${moduleId}-${i + 1}`, // Generar un nuevo ID único
            name: isEdited
              ? `${formData[moduleId].name} (editado ${i + 1})`
              : `${formData[moduleId].name} (${i + 1})`,
            pieces: modulePieces,
          }));

          return newModules;
        })
      ).then((modules) => modules.flat());

      await createFurniture({
        ...data,
        modules_furniture: editedModules,
      }).then((res) => {
        const furnitureId = res.data._id;
        console.log("¡Creaste el mueble con éxito!");
        setTimeout(() => {
          navigate(`/editar-modulos-mueble/${furnitureId}`);
        }, 100);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllModulesToSet();
    getFurnitureData();
  }, []);

  return (
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Editar Mueble</h1>

        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Volver al Inicio
        </Link>
        <Link
          to={`/ver-muebles`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Ver muebles
        </Link>
      </div>
      <form action="" className="w-1/2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="name">Nombre del mueble</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="name"
            id="name"
            {...register("name", { required: "El campo es obligatorio" })}
          />
          {errors.name && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="height">Alto</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="height"
            id="height"
            {...register("height", { required: "El campo es obligatorio" })}
          />
          {errors.height && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.height.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="length">Largo</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="length"
            id="length"
            {...register("length", { required: "El campo es obligatorio" })}
          />
          {errors.length && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.length.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="width">Profundidad</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="width"
            id="width"
            {...register("width", { required: "El campo es obligatorio" })}
          />
          {errors.width && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.width.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="category">Categoria</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="category"
            id="category"
            {...register("category", { required: "El campo es obligatorio" })}
          />
          {errors.category && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.category.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="modules">Módulos</label>
          <div className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12 overflow-y-auto max-h-40">
            {modules.map((module) => (
              <div key={module._id} className="flex items-center p-2">
                <input
                  type="checkbox"
                  id={`module-${module._id}`}
                  value={module._id}
                  onChange={handleModuleChange}
                  className="mr-2"
                  name={`module-${module._id}`}
                />
                <label htmlFor={`module-${module._id}`}>{module.name}</label>
                {selectedModuleIds.includes(module._id) && (
                  <>
                    <label htmlFor={`qty-module-${module._id}`}>Cantidad</label>
                    <input
                      className="border-solid border-2 border-opacity ml-2 rounded-md w-1/12"
                      type="number"
                      name={`qty-module-${module._id}`}
                      min="1"
                      value={moduleQuantities[module._id] || 0}
                      onChange={(e) =>
                        handleInputChange(module._id, e.target.value)
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

        <div className="mt-4">
          <h2 className="text-2xl">Módulos Seleccionados:</h2>
          <div>
            {selectedModules.flatMap((module, index) => (
              <div
                key={module._id + "-" + index}
                className="border-solid border-2 border-opacity mb-2 rounded-md p-4 flex items-center justify-between"
              >
                <p>{module.name}</p>
                <button
                  type="button"
                  onClick={() => handleOpenModal(module)}
                  className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
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
                          {formData[selectedModule._id]?.name || ""}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-left">
                          Largo
                        </th>
                        <td className="border border-gray-400 px-4 py-2">
                          {formData[selectedModule._id]?.length || ""}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-left">
                          Ancho
                        </th>
                        <td className="border border-gray-400 px-4 py-2">
                          {formData[selectedModule._id]?.width || ""}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-left">
                          Alto
                        </th>
                        <td className="border border-gray-400 px-4 py-2">
                          {formData[selectedModule._id]?.height || ""}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-left">
                          Cantidad de piezas
                        </th>
                        <td className="border border-gray-400 px-4 py-2">
                          {formData[selectedModule._id]?.pieces_number || ""}
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

        <button
          className="bg-blue-700 hover:bg-blue-500 text-white px-4 rounded-md"
          type="submit"
        >
          Crear
        </button>
      </form>
    </div>
  );
}

export { EditFurnitureComponent };
