// views/FurnitureCategories/EditFurnitureCategory.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid, Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getFurnitureCategoryById,
  updateFurnitureCategory,
} from "../../index.js";

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

function EditFurnitureCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const ENV = import.meta.env.VITE_ENV;

  const [loader, setLoader] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [parameterValue, setParameterValue] = useState(""); // estado del editor

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const category = await getFurnitureCategoryById(categoryId);

        reset({
          name: category.name || "",
          parameter: category.parameter || "",
        });

        // seteamos también el valor visible del editor
        setParameterValue(category.parameter || "");
      } catch (err) {
        console.error("Error al obtener categoría:", err);
      } finally {
        setLoader(false);
      }
    }

    fetchCategory();
  }, [categoryId, reset]);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    if (submitLoader) return;
    setSubmitLoader(true);

    try {
      await updateFurnitureCategory(categoryId, {
        name: data.name,
        parameter: parameterValue || "",
      });

      navigate("/ver-categorias-muebles");
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
    } finally {
      setSubmitLoader(false);
    }
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Grid
          visible={true}
          height="80"
          width="80"
          color="rgb(92, 92, 92)"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  return (
    <div className="pb-8 px-16 bg-gray-100 min-h-screen">
      <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
        <h1 className="text-4xl font-semibold text-white">
          Editar Categoría de Mueble
        </h1>
        <div className="flex gap-3">
          <Link
            to="/ver-categorias-muebles"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
          >
            <img src="./../icon_back.svg" alt="Volver" className="w-[20px]" />
            <p className="m-0 leading-loose">Volver</p>
          </Link>
        </div>
      </div>

      {ENV === "TEST" && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
          ⚠️ Estás en entorno de pruebas (TEST)
        </div>
      )}

      <form
        className="w-full max-w-2xl m-auto p-12 rounded-lg bg-white shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Nombre de la categoría
            </label>
            <input
              id="name"
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 w-full"
              {...register("name", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.name && (
              <span className="text-xs text-red-700 mt-2">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Parámetros con ReactQuill */}
          <div className="flex flex-col">
            <label htmlFor="parameter" className="text-gray-700 font-medium">
              Parámetros (texto enriquecido)
            </label>

            {/* Campo real para RHF (oculto) */}
            <input type="hidden" id="parameter" {...register("parameter")} />

            {/* Editor visual */}
            <ReactQuill
              theme="snow"
              value={parameterValue}
              onChange={(value) => {
                setParameterValue(value);
                setValue("parameter", value, { shouldValidate: false });
              }}
              modules={quillModules}
              formats={quillFormats}
              className="
                bg-white border border-gray-300 rounded-md
                [&_.ql-editor]:min-h-[180px]
                [&_.ql-editor]:text-gray-900
                [&_.ql-editor]:text-base
              "
            />

            <p className="text-xs text-gray-500 mt-1">
              Este texto se usará como base de comentarios al crear muebles y
              presupuestos de esta categoría.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            className={`px-6 py-2 max-h-10 w-1/3 rounded-md text-light font-medium ${
              submitLoader
                ? "bg-amber-400 opacity-70 cursor-not-allowed"
                : "bg-amber-500"
            }`}
            type="submit"
            disabled={submitLoader}
          >
            {submitLoader ? (
              <div className="flex items-center justify-center gap-2">
                <Oval
                  visible={submitLoader}
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
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export { EditFurnitureCategory };
