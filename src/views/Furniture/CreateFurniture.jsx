import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createFurniture,
  getAllModules,
  getPiecesByModuleId,
  ViewModulesFurniture,
} from "../../index.js";

function CreateFurniture() {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [moduleQuantities, setModuleQuantities] = useState({});

  // Manejo de la ventana modal
  const handleOpenModal = async (module) => {
    try {
      // Obtén las piezas por el ID del módulo
      const pieces = await getPiecesByModuleId(module._id);

      // Agrega las piezas al módulo bajo el nombre 'pieces'
      const moduleWithPieces = { ...module, pieces };

      // Envuelve el módulo en un array y establece 'selectedModules'
      setSelectedModule([moduleWithPieces]);

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

        navigate(`/editar-modulos-mueble/${furnitureId}`);
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
          to={`/ver-muebles`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Ver muebles
        </Link>
      </div>
      <form
        action=""
        className="w-1/2"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
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
            {...register("length")}
          />
          {errors.length && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.length.message}
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
            {...register("height")}
          />
          {errors.height && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.height.message}
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
            {...register("width")}
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
            {...register("category")}
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

export { CreateFurniture };
