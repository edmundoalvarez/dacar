import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getClientById, updateClient } from "../../index.js";

function EditClient() {
  const { clientId } = useParams(); // Obtener los ID del mueble y del módulo desde la URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getClientToSet = () => {
    getClientById(clientId)
      .then((clientData) => {
        const client = clientData.data;
        setValue("name", client.name);
        setValue("lastname", client.lastname);
        setValue("phone", client.phone);
        setValue("email", client.email);
        setValue("dni", client.dni);
        setValue("cuil_cuit", client.cuil_cuit);
        setValue("address", client.address);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getClientToSet();
  }, []);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      await updateClient(clientId, data);
      navigate("/ver-clientes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {" "}
      <div className="p-8">
        <div className="flex gap-4">
          <h1 className="text-4xl">Editar Cliente</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver al Inicio
          </Link>
          <Link
            to={`/ver-insumos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver a Insumos
          </Link>
        </div>
        <form action="" className="w-1/2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-11/12 my-2">
            <label htmlFor="name">Nombre</label>
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
            <label htmlFor="lastname">Apellido</label>
            <input
              className=" border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
              type="text"
              name="lastname"
              id="lastname"
              {...register("lastname", {})}
            />
            {errors.lastname && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors.lastname.message}
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
    </>
  );
}

export { EditClient };
