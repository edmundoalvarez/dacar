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
    <div className="py-8 px-16 bg-gray-100 min-h-screen">
      <div className="flex gap-4 items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Crear Servicio</h1>
        <div className="flex gap-3">
          <Link
            to="/"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Volver al Inicio
          </Link>
          <Link
            to={`/ver-servicios`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Ver Servicios
          </Link>
        </div>
      </div>

      <form
        action=""
        className="w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col my-4">
          <label htmlFor="name" className="text-gray-700 font-medium">
            Nombre del servicio
          </label>
          <input
            className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
            type="text"
            name="name"
            id="name"
            {...register("name", { required: "El campo es obligatorio" })}
          />
          {errors.name && (
            <span className="text-sm text-red-600 mt-1">
              {errors.name.message}
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
            {...register("price", { required: "El campo es obligatorio" })}
          />
          {errors.price && (
            <span className="text-sm text-red-600 mt-1">
              {errors.price.message}
            </span>
          )}
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

export { CreateServicesFurniture };
