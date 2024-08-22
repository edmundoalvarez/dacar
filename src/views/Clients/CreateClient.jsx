import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient, FormCreateClient } from "../../index.js";

function CreateClient() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await createClient(data).then(() => {
        console.log("¡creaste el cliente con exito!");
        navigate("/ver-clientes");
      });
    } catch (error) {
      console.error(error);
      /*       setIsLoading(false); */
    }
  };

  return (
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Cliente</h1>

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
          <label htmlFor="client_name">Nombre</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="client_name"
            id="client_name"
            {...register("client_name", {
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
          <label htmlFor="client_lastname">Apellido</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="client_lastname"
            id="client_lastname"
            {...register("client_lastname", {})}
          />
          {errors.client_lastname && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.client_lastname.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="phone">Teléfono</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="phone"
            id="phone"
            {...register("phone", {})}
          />
          {errors.phone && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.phone.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="email">Email</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="email"
            id="email"
            {...register("email", {})}
          />
          {errors.email && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="dni">DNI</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="dni"
            id="dni"
            {...register("dni")}
          />
          {errors.dni && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.dni.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="cuil_cuit">CUIT/CUIL</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="cuil_cuit"
            id="cuil_cuit"
            {...register("cuil_cuit")}
          />
          {errors.cuil_cuit && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.cuil_cuit.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-11/12 my-2">
          <label htmlFor="address">Dirección</label>
          <input
            className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="address"
            id="address"
            {...register("address")}
          />
          {errors.address && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.address.message}
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

export { CreateClient };
