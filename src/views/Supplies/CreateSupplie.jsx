import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createSupplies, getAllSuppliesCategories } from "../../index.js";

function CreateSupplie() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // TRAER CATEGORIAS: para el formulario
  const getAllCategoriesToSet = () => {
    getAllSuppliesCategories()
      .then((categoriesData) => {
        setCategories(categoriesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await createSupplies(data).then(() => {
        console.log("¡creaste el insumo con exito!");
        navigate("/ver-insumos");
      });
    } catch (error) {
      console.error(error);
      /*       setIsLoading(false); */
    }
  };
  useEffect(() => {
    getAllCategoriesToSet();
  }, []);

  return (
    <div className="py-8 px-16 bg-gray-100 min-h-screen">
      <div className="flex gap-4 items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Crear Insumo</h1>
        <div className="flex gap-3">
          <Link
            to="/"
            className="bg-emerald-600 py-2 px-4 rounded-full hover:bg-emerald-700 text-white font-medium transition duration-300"
          >
            Volver al Inicio
          </Link>
          <Link
            to={`/ver-insumos`}
            className="bg-emerald-600 py-2 px-4 rounded-full hover:bg-emerald-700 text-white font-medium transition duration-300"
          >
            Ver insumos
          </Link>
        </div>
      </div>
      <form
        action=""
        className="w-full max-w-xl"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="flex justify-between gap-4">
          <div className="w-1/2">
            <div className="flex flex-col my-4">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Nombre del insumo
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
            <div className="flex flex-col my-4">
              <label htmlFor="length" className="text-gray-700 font-medium">
                Largo
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                type="text"
                name="length"
                id="length"
                {...register("length", {})}
              />
              {errors.length && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.length.message}
                </span>
              )}
            </div>
            <div className="flex flex-col my-4">
              <label htmlFor="width" className="text-gray-700 font-medium">
                Ancho
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                type="text"
                name="width"
                id="width"
                {...register("width", {})}
              />
              {errors.width && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.width.message}
                </span>
              )}
            </div>
            <div className="flex flex-col my-4">
              <label htmlFor="thickness" className="text-gray-700 font-medium">
                Grosor
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                type="text"
                name="thickness"
                id="thickness"
                {...register("thickness", {})}
              />
              {errors.thickness && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.thickness.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col my-4">
              <label htmlFor="category" className="text-gray-700 font-medium">
                Categoria
              </label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                name="category"
                id="category"
                {...register("category", {
                  required: "El campo es obligatorio",
                })}
              >
                <option key="" value="">
                  Elegir una opción
                </option>
                {categories.map((category, index) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.category.message}
                </span>
              )}
            </div>
            <div className="flex flex-col my-4">
              <label htmlFor="material" className="text-gray-700 font-medium">
                Material
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                type="text"
                name="material"
                id="material"
                {...register("material")}
              />
              {errors.material && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.material.message}
                </span>
              )}
            </div>
            <div className="flex flex-col my-4">
              <label htmlFor="price" className="text-gray-700 font-medium">
                Precio
              </label>
              <input
                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
                type="text"
                name="price"
                id="price"
                {...register("price", {
                  required: "El campo es obligatorio",
                })}
              />
              {errors.price && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export { CreateSupplie };
