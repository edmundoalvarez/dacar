import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createFurniture, getAllModules } from "../../index.js";

function CreateFurniture() {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [editModule, setEditModule] = useState(null); // Estado para el módulo en edición

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
    setValue, // Para establecer valores en el formulario de edición
  } = useForm();

  const handleModuleChange = (e) => {
    const { value, checked } = e.target;
    const selectedModule = modules.find((module) => module._id === value);

    setSelectedModules((prev) =>
      checked
        ? [...prev, selectedModule]
        : prev.filter((module) => module._id !== value)
    );
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      console.log(data);

      await createFurniture({
        ...data,
        modules_furniture: selectedModules,
      }).then(() => {
        console.log("¡Creaste el mueble con éxito!");
        setTimeout(() => {
          navigate("/");
        }, 100);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllModulesToSet();
  }, []);

  const handleEditClick = (module) => {
    setEditModule(module);
    // Establecer los valores del formulario con los datos del módulo seleccionado
    setValue("editName", module.name);
    setValue("editLength", module.length);
    setValue("editWidth", module.width);
    setValue("editHeight", module.height);
    setValue("editPiecesNumber", module.pieces_number);
  };

  const handleEditSubmit = (data) => {
    // Actualizar el módulo con los datos del formulario
    const updatedModules = selectedModules.map((module) =>
      module._id === editModule._id ? { ...editModule, ...data } : module
    );
    setSelectedModules(updatedModules);
    setEditModule(null); // Cerrar el formulario de edición
  };

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

        <button
          className="bg-blue-700 hover:bg-blue-500 text-white px-4 rounded-md"
          type="submit"
        >
          Enviar
        </button>
      </form>

      <div className="mt-4">
        <h2 className="text-2xl">Módulos Seleccionados:</h2>
        <ul className="list-disc pl-5">
          {selectedModules.map((module) => (
            <li key={module._id}>
              <p>Nombre: {module.name}</p>
              <p>Profundidad: {module.length}</p>
              <p>Ancho: {module.width}</p>
              <p>Alto: {module.height}</p>
              <p>Cantidad de piezas :{module.pieces_number}</p>
              <ul className="list-disc pl-5">
              {module.supplies_module.map((supplie_module) =>
                <li key={supplie_module.supplie_id}>
                  <p>Nombre: {supplie_module.supplie_name}</p>
                  <p>Cantidad: {supplie_module.supplie_qty}</p>
                  <p>Largo: {supplie_module.supplie_length}</p>
                </li>
              )}
              </ul>
              <button 
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 rounded-md"
                onClick={() => handleEditClick(module)}
                >Editar</button>
              <hr />
            </li>
          ))}
        </ul>

        {editModule && (
          <form onSubmit={handleSubmit(handleEditSubmit)} className="mt-4">
            <h2 className="text-2xl">Editar Módulo: {editModule.name}</h2>
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="editName">Nombre del Módulo</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
                type="text"
                name="editName"
                id="editName"
                {...register("editName", { required: "El campo es obligatorio" })}
              />
              {errors.editName && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.editName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="editLength">Largo</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
                type="text"
                name="editLength"
                id="editLength"
                {...register("editLength", { required: "El campo es obligatorio" })}
              />
              {errors.editLength && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.editLength.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="editWidth">Ancho</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
                type="text"
                name="editWidth"
                id="editWidth"
                {...register("editWidth", { required: "El campo es obligatorio" })}
              />
              {errors.editWidth && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.editWidth.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="editHeight">Alto</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
                type="text"
                name="editHeight"
                id="editHeight"
                {...register("editHeight", { required: "El campo es obligatorio" })}
              />
              {errors.editHeight && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.editHeight.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="editPiecesNumber">Cantidad de Piezas</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
                type="text"
                name="editPiecesNumber"
                id="editPiecesNumber"
                {...register("editPiecesNumber", { required: "El campo es obligatorio" })}
              />
              {errors.editPiecesNumber && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.editPiecesNumber.message}
                </span>
              )}
            </div>
            <button
              className="bg-green-700 hover:bg-green-500 text-white px-4 rounded-md"
              type="submit"
            >
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export { CreateFurniture };
