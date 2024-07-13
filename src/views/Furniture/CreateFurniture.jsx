import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createFurniture,
  getAllModules,
  getPiecesByModuleId,
} from "../../index.js";

function CreateFurniture() {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleModuleChange = (e) => {
    const { value, checked } = e.target;
    const selectedModule = modules.find((module) => module._id === value);

    setSelectedModules((prev) =>
      checked
        ? [...prev, selectedModule]
        : prev.filter((module) => module._id !== value)
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

  const handleInputChange = (moduleId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      // Creamos un nuevo objeto con los datos del Módulo seleccionado (con cambios o sin cambios)
      const editedModules = await Promise.all(
        selectedModules.map(async (module) => {
          const moduleId = module._id;
          // Comparamos los objetos para ver si hay cambios y así poder agregar "(editado)" al nombre del módulo
          const isEdited =
            JSON.stringify(formData[moduleId]) !==
            JSON.stringify(originalData[moduleId]);

          // Obtener las piezas correspondientes al módulo actual
          const modulePieces = await getPiecesByModuleId(moduleId); // Esperar a que se resuelva la promesa

          return {
            ...module,
            ...formData[moduleId],
            // Agregamos "(editado)" al nombre del módulo si hubo cambios en sus propiedades
            name: isEdited
              ? `${formData[moduleId].name} (editado)`
              : formData[moduleId].name,
            pieces: modulePieces, // Agregar las piezas correspondientes al módulo
          };
        })
      );

      console.log(data);

      await createFurniture({
        ...data,
        modules_furniture: editedModules,
      }).then(() => {
        console.log("¡Creaste el mueble con éxito!");
        setTimeout(() => {
          navigate(`/editar-modulos-meueble/${furnitureId}`);
        }, 100);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllModulesToSet();
  }, []);

  return (
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Mueble</h1>

        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Volver al Inicio
        </Link>
        <Link
          to={`/ver-placas`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Ver placas
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
          <label htmlFor="width">Ancho</label>
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
                />
                <label htmlFor={`module-${module._id}`}>{module.name}</label>
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
            {selectedModules.map((module) => (
              <div
                key={module._id}
                className="border-solid border-2 border-opacity mb-2 rounded-md p-4 flex items-center justify-between"
              >
                <p>{module.name}</p>
                <button
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
                <div className="mb-2">
                  <div className="flex flex-col w-11/12 my-2">
                    <label htmlFor={`name-${selectedModule._id}`}>Nombre</label>
                    <input
                      type="text"
                      id={`name-${selectedModule._id}`}
                      value={formData[selectedModule._id]?.name || ""}
                      onChange={(e) =>
                        handleInputChange(
                          selectedModule._id,
                          "name",
                          e.target.value
                        )
                      }
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col w-11/12 my-2">
                    <label htmlFor={`length-${selectedModule._id}`}>
                      Largo
                    </label>
                    <input
                      type="text"
                      id={`length-${selectedModule._id}`}
                      value={formData[selectedModule._id]?.length || ""}
                      onChange={(e) =>
                        handleInputChange(
                          selectedModule._id,
                          "length",
                          e.target.value
                        )
                      }
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col w-11/12 my-2">
                    <label htmlFor={`width-${selectedModule._id}`}>Ancho</label>
                    <input
                      type="text"
                      id={`width-${selectedModule._id}`}
                      value={formData[selectedModule._id]?.width || ""}
                      onChange={(e) =>
                        handleInputChange(
                          selectedModule._id,
                          "width",
                          e.target.value
                        )
                      }
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col w-11/12 my-2">
                    <label htmlFor={`height-${selectedModule._id}`}>Alto</label>
                    <input
                      type="text"
                      id={`height-${selectedModule._id}`}
                      value={formData[selectedModule._id]?.height || ""}
                      onChange={(e) =>
                        handleInputChange(
                          selectedModule._id,
                          "height",
                          e.target.value
                        )
                      }
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col w-11/12 my-2">
                    <label htmlFor={`pieces_number-${selectedModule._id}`}>
                      Cantidad de piezas
                    </label>
                    <input
                      type="text"
                      id={`pieces_number-${selectedModule._id}`}
                      value={formData[selectedModule._id]?.pieces_number || ""}
                      onChange={(e) =>
                        handleInputChange(
                          selectedModule._id,
                          "pieces_number",
                          e.target.value
                        )
                      }
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                    />
                  </div>
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
          Enviar
        </button>
      </form>
    </div>
  );
}

export { CreateFurniture };
