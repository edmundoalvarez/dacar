import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createService } from "../../index.js";

function CreateServicesFurniture() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await createService(data).then(() => {
        console.log("¡creaste el servicio con exito!");
        navigate("/ver-servicios");
      });
    } catch (error) {
      console.error(error);
      /*       setIsLoading(false); */
    }
  };

  return (
    <div className="m-4 p-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Servicio</h1>

        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Volver al Inicio
        </Link>
        <Link
          to={`/ver-servicios`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
        >
          Ver Servicios
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

export { CreateServicesFurniture };
