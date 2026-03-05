// views/Furniture/CreateFurniture.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import Select from "react-select";
import {
  createFurniture,
  getAllModules,
  getPiecesByModuleId,
  ViewModulesFurniture,
  getFurnitureCategories,
} from "../../index.js";
import QuillEditor from "../../components/QuillEditor.jsx";

// Configuración de ReactQuill
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
];

function CreateFurniture() {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [moduleQuantities, setModuleQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // loader del submit

  // Editor de texto de parámetros
  const [parameterValue, setParameterValue] = useState("");

  const navigate = useNavigate();

  // --- helper: solo los campos que cambiaron en el módulo ---
  const getOverrides = (original, edited) => {
    const diff = {};
    const editedSafe = edited || {};
    const originalSafe = original || {};
    for (const k of Object.keys(editedSafe)) {
      if (JSON.stringify(editedSafe[k]) !== JSON.stringify(originalSafe[k])) {
        diff[k] = editedSafe[k];
      }
    }
    return diff;
  };

  // Modal "Ver" (solo lee piezas para mostrar)
  const handleOpenModal = async (module) => {
    try {
      const pieces = await getPiecesByModuleId(module._id);
      const moduleWithPieces = { ...module, pieces };
      setSelectedModule([moduleWithPieces]);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener las piezas del módulo:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
    setIsModalOpen(false);
  };

  const getAllModulesToSet = () => {
    getAllModules()
      .then((modulesData) => {
        setModules(modulesData.data);
      })
      .catch((error) => console.error(error));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const handleModuleChange = (e) => {
    const { value, checked } = e.target;
    const selectedModule = modules.find((m) => m._id === value);

    setSelectedModules((prev) =>
      checked ? [...prev, selectedModule] : prev.filter((m) => m._id !== value)
    );
    setSelectedModuleIds((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );

    if (checked) {
      // seteo datos de edición
      setFormData((prev) => ({
        ...prev,
        [selectedModule._id]: { ...selectedModule },
      }));
      setOriginalData((prev) => ({
        ...prev,
        [selectedModule._id]: { ...selectedModule },
      }));
      // default de cantidad = 1
      setModuleQuantities((prev) => ({
        ...prev,
        [selectedModule._id]: prev[selectedModule._id] || 1,
      }));
    } else {
      setFormData((prev) => {
        const nd = { ...prev };
        delete nd[selectedModule._id];
        return nd;
      });
      setOriginalData((prev) => {
        const no = { ...prev };
        delete no[selectedModule._id];
        return no;
      });
      setModuleQuantities((prev) => {
        const nq = { ...prev };
        delete nq[selectedModule._id];
        return nq;
      });
    }
  };

  const handleInputChange = (moduleId, value) => {
    setModuleQuantities((prev) => ({
      ...prev,
      [moduleId]: parseInt(value, 10),
    }));
  };

  // --- SUBMIT: payload mínimo ---
  const onSubmit = async (data, event) => {
    event.preventDefault();
    if (isSubmitting) return; // evita doble click
    setIsSubmitting(true);

    try {
      const modulesMinimal = selectedModules.map((m) => ({
        moduleId: m._id,
        quantity: moduleQuantities[m._id] || 1,
        overrides: getOverrides(originalData[m._id], formData[m._id]),
      }));

      const res = await createFurniture({
        ...data,
        modules_furniture: modulesMinimal,
      });

      const furnitureId = res.data._id;
      navigate(`/editar-modulos-mueble/${furnitureId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getAllModulesToSet();

    setCategoriesLoading(true);
    getFurnitureCategories()
      .then((res) => {
        const cats = Array.isArray(res) ? res : [];
        setCategories(cats || []);
      })
      .catch((error) => {
        console.error("Error al traer categorías de muebles:", error);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  const fields = [
    { name: "name", label: "Nombre del mueble", required: true },
    { name: "length", label: "Largo" },
    { name: "height", label: "Alto" },
    { name: "width", label: "Profundidad" },
  ];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredModules = modules.filter((module) => {
    const term = searchTerm.toLowerCase();
    return (
      module.name.toLowerCase().includes(term) ||
      module.description.toLowerCase().includes(term)
    );
  });

  // Cuando cambia la categoría, prelleno el editor con los parámetros de esa categoría
  const handleCategoryChange = (categoryId) => {

    // React Hook Form ya setea categoryId por el register, no hace falta setValue aquí
    const selectedCategory = categories.find((c) => c._id === categoryId);
    const paramHtml = selectedCategory?.parameter || "";

    // Editor controlado
    setParameterValue(paramHtml);
    // Campo real del formulario (hidden)
    setValue("parameter", paramHtml, { shouldValidate: true });
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#10b981" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      minHeight: "40px",
      backgroundColor: "#ffffff",
      color: "#111827",
    }),
    menu: (base) => ({ ...base, zIndex: 30 }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
    input: (base) => ({
      ...base,
      color: "#111827",
    }),
    menuList: (base) => ({ ...base, backgroundColor: "#ffffff" }),
    option: (base, state) => ({
      ...base,
      color: "#111827",
      backgroundColor: state.isSelected
        ? "#d1fae5"
        : state.isFocused
          ? "#f3f4f6"
          : "#ffffff",
    }),
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <div className="pb-8 px-16 bg-gray-100 min-h-screen">
      <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
        <h1 className="text-4xl font-semibold text-white">Crear Mueble</h1>
        <div className="flex items-center gap-4">
          <Link
            to={`/ver-muebles`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
          >
            <img
              src="./icon_back.svg"
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
              src="./icon_home.svg"
              alt="Icono de budgets"
              className="w-[20px]"
            />
            <p className="m-0 leading-loose">Ir a Inicio</p>
          </Link>
        </div>
      </div>

      <form
        className="w-full max-w-full m-auto p-12 rounded-lg bg-white shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="flex">
          {/* Campos del formulario */}
          <div className="flex flex-col w-1/2">
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col w-11/12 my-2">
                <label
                  htmlFor={field.name}
                  className="text-gray-700 font-medium"
                >
                  {field.label}
                </label>
                <input
                  className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
                  type="text"
                  id={field.name}
                  {...register(field.name, {
                    required: field.required
                      ? "El campo es obligatorio"
                      : false,
                  })}
                />
                {errors[field.name] && (
                  <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                    {errors[field.name].message}
                  </span>
                )}
              </div>
            ))}

            {/* Select de categoría */}
            <div className="flex flex-col w-11/12 my-2">
              <label htmlFor="categoryId" className="text-gray-700 font-medium">
                Categoría
              </label>

              <Controller
                name="categoryId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    inputId="categoryId"
                    instanceId="categoryId"
                    placeholder="Selecciona una categoría"
                    isClearable
                    isDisabled={categoriesLoading || categories.length === 0}
                    options={categoryOptions}
                    value={
                      categoryOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(option) => {
                      const value = option?.value || "";
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                    styles={selectStyles}
                  />
                )}
              />

              {errors.categoryId && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.categoryId.message}
                </span>
              )}
            </div>

            {/* Parámetros con ReactQuill */}
            <div className="flex flex-col w-11/12 my-2 mb-6">
              <label htmlFor="parameter" className="text-gray-700 font-medium">
                Parámetros
              </label>

              {/* Campo real para RHF (oculto) */}
              <input type="hidden" id="parameter" {...register("parameter")} />

              <QuillEditor
                theme="snow"
                value={parameterValue}
                onChange={(value) => {
                  setParameterValue(value);
                  setValue("parameter", value, { shouldValidate: true });
                }}
                modules={quillModules}
                formats={quillFormats}
                className="
      w-full bg-white border border-gray-300 rounded-md overflow-hidden
      [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-300
      [&_.ql-container]:border-0
      [&_.ql-container]:min-h-[220px]
      [&_.ql-editor]:min-h-[220px]
      [&_.ql-editor]:text-gray-800
    "
              />

              <p className="text-xs text-gray-500 mt-2">
                Este texto se puede usar como descripción ampliada o base para
                comentarios futuros del mueble.
              </p>
            </div>
          </div>

          {/* Tabla de módulos disponibles */}
          <div className="mb-6 w-1/2">
            <label
              htmlFor="modules"
              className="block font-semibold text-lg text-gray-800 mb-2"
            >
              Módulos Disponibles
            </label>
            {/* Campo de búsqueda */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre o descripción"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="border border-gray-300 rounded-lg overflow-y-auto max-h-80">
              <table className="min-w-full">
                <thead className="bg-gray-200 sticky top-0 text-gray-600 text-sm font-medium">
                  <tr>
                    {["Seleccionar", "Nombre", "Descripción", "Cantidad"].map(
                      (header, index) => (
                        <th key={index} className="px-4 py-2 text-left">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module) => (
                    <tr key={module._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-t border-gray-200">
                        <input
                          type="checkbox"
                          id={`module-${module._id}`}
                          value={module._id}
                          onChange={handleModuleChange}
                          checked={selectedModuleIds.includes(module._id)}
                          className="rounded-sm text-emerald-500 focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        <label
                          htmlFor={`module-${module._id}`}
                          className="font-medium"
                        >
                          {module.name}
                        </label>
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200 text-gray-700">
                        {module.description}
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200 text-center">
                        {selectedModuleIds.includes(module._id) ? (
                          <input
                            className="border border-gray-300 bg-gray-100 rounded-md px-2 py-1 w-20 text-center"
                            type="number"
                            min="1"
                            value={moduleQuantities[module._id] || 0}
                            onChange={(e) =>
                              handleInputChange(module._id, e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {errors.modules_furniture && (
              <span className="text-red-600 text-sm mt-2">
                {errors.modules_furniture.message}
              </span>
            )}
          </div>
        </div>

        {/* Módulos Seleccionados */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Módulos Seleccionados:
          </h2>
          <div>
            {selectedModules.flatMap((module, index) => (
              <div
                key={module._id + "-" + index}
                className="text-black border border-gray-300 rounded-md p-4 my-2 flex items-center justify-between bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{module.name}</p>
                  <span className="text-sm bg-emerald-600  text-white  rounded-full px-3 py-1">
                    x{moduleQuantities[module._id] ?? 1}
                  </span>
                </div>

                <p className="text-gray-700">{module.description}</p>

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
            <div
              onClick={handleCloseModal}
              className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-lg shadow-lg max-h-[660px] overflow-y-auto relative"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  &times;
                </button>
                <ViewModulesFurniture sortedModules={selectedModule} />
                <button
                  onClick={handleCloseModal}
                  className="bg-red-500 text-white py-2 px-4 rounded mt-4 hover:bg-red-600 transition duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botón de Crear */}
        <div className="flex justify-center mt-10">
          <button
            className={`px-6 py-2 max-h-10 w-1/6 rounded-md text-light font-medium
                ${
                  isSubmitting
                    ? "bg-amber-400 opacity-70 cursor-not-allowed"
                    : "bg-amber-500"
                }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Oval
                  visible={isSubmitting}
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
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export { CreateFurniture };
