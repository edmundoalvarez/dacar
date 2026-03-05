// views/FurnitureCategories/CreateFurnitureCategory.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import QuillEditor from "../../components/QuillEditor.jsx";
import { createFurnitureCategory } from "../../index.js";

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

function CreateFurnitureCategory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parameterValue, setParameterValue] = useState(""); // editor controlado

  const navigate = useNavigate();
  const ENV = import.meta.env.VITE_ENV;

  const onSubmit = async (data, event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createFurnitureCategory({
        name: data.name,
        parameter: parameterValue || "",
      });

      navigate("/ver-categorias-muebles");
    } catch (err) {
      console.error("Error al crear categoría:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-8 px-16 bg-gray-100 min-h-screen">
      <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
        <h1 className="text-4xl font-semibold text-white">
          Crear Categoría de Mueble
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
                />
              </div>
            ) : (
              "Crear categoría"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export { CreateFurnitureCategory };
