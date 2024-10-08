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
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Insumo</h1>

        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Volver al Inicio
        </Link>
        <Link
          to={`/ver-insumos`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Ver insumos
        </Link>
      </div>
      <form action="" className="w-1/2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="name">Nombre del insumo</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
          <label htmlFor="length">Largo</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="width">Ancho</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="thickness">Grosor</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="category">Categoria</label>
          <select
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="material">Material</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="price">Precio</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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

export { CreateSupplie };
