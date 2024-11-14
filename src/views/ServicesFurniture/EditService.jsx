import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getServiceById, updateService } from "../../index.js";

function EditService() {
  const { idService } = useParams(); // Obtener los ID del mueble y del módulo desde la URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getServiceToSet = () => {
    getServiceById(idService)
      .then((supplieData) => {
        const supplie = supplieData.data;
        setValue("name", supplie.name);
        setValue("price", supplie.price);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getServiceToSet();
  }, []);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await updateService(idService, data);
      navigate("/ver-servicios");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {" "}
      <div className="py-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Editar Servicio
          </h1>

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
            Volver a Servicios
          </Link>
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
              className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 focus:ring focus:ring-emerald-200 w-full transition duration-200"
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
            <label htmlFor="price" className="text-gray-700 font-medium">
              Precio
            </label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 mt-1 focus:border-emerald-500 focus:ring focus:ring-emerald-200 w-full transition duration-200"
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
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export { EditService };
