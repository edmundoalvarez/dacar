import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createMainTable } from "../../index.js";

function CreateMainTable() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await createMainTable(data).then(() => {
        console.log("¡creaste la placa con exito!");
        setTimeout(() => {
          /*  navigate("/iniciar-sesion"); */
          window.location.reload(true);
        }, 1500);
      });
    } catch (error) {
      console.error(error);
      /*       setIsLoading(false); */
    }
  };

  return (
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Placa</h1>

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
          <label htmlFor="name">Nombre de la placa</label>
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
          <label htmlFor="length">Alto</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="width">Largo</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="thickness">Grosor</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="thickness"
            id="thickness"
            {...register("thickness", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.thickness && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.thickness.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="category">Categoria</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="material">Material</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="material"
            id="material"
            {...register("material", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.material && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.material.message}
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

export { CreateMainTable };
