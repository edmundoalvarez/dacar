import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../../index.js";

function CreateUser() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setApiError("");

    try {
      await createUser(data);
      console.log("¡creaste el usuario con éxito!");
      navigate("/ver-usuarios"); // ruta del listado de usuarios
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Ocurrió un error al crear el usuario.";
      setApiError(msg);
    }
  };

  return (
    <div className="pb-8 px-16 bg-gray-100 min-h-screen">
      <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
        <h1 className="text-4xl font-semibold text-white">Crear Usuario</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/ver-usuarios"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
          >
            <img
              src="./icon_back.svg"
              alt="Volver a usuarios"
              className="w-[18px]"
            />
            <p className="m-0 leading-loose">Volver</p>
          </Link>
          <Link
            to="/"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
          >
            <img src="./icon_home.svg" alt="Ir a inicio" className="w-[20px]" />
            <p className="m-0 leading-loose">Ir a Inicio</p>
          </Link>
        </div>
      </div>

      <form
        className="flex flex-row flex-wrap gap-2 w-full max-w-5xl m-auto p-12 rounded-lg bg-white shadow-sm text-gray-700"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* error desde la API (username duplicado, etc.) */}
        {apiError && (
          <div className="w-full mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-row w-full gap-6 ">
          <div className="flex flex-col w-1/2 ">
            <label className="font-medium" htmlFor="name">
              Nombre
            </label>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="text"
              id="name"
              {...register("name", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.name && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2 ">
            <label className="font-medium" htmlFor="lastname">
              Apellido
            </label>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="text"
              id="lastname"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors.lastname.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row w-full gap-6 ">
          <div className="flex flex-col w-1/2 my-2">
            <label className="font-medium" htmlFor="username">
              Usuario (para login)
            </label>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="text"
              id="username"
              {...register("username", {
                required: "El usuario es obligatorio",
                minLength: {
                  value: 3,
                  message: "El usuario debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.username && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2 my-2">
            <label htmlFor="email">Email</label>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="text"
              id="email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row w-full gap-6 ">
          <div className="flex flex-col w-1/2 my-2">
            <label className="font-medium" htmlFor="password">
              Contraseña
            </label>
            <input
              className="border border-gray-300 rounded-md p-2"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
                validate: {
                  hasUpper: (v) =>
                    /[A-Z]/.test(v) ||
                    "Debe contener al menos una letra mayúscula",
                  hasNumber: (v) =>
                    /[0-9]/.test(v) || "Debe contener al menos un número",
                },
              })}
            />
            <span className="text-xs text-gray-500 mt-1">
              Debe tener al menos 6 caracteres, una mayúscula y un número.
            </span>
            {errors.password && (
              <span className="text-xs xl:text-base text-red-700 mt-1 block text-left">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2 my-2">
            <label className="font-medium" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              className="border border-gray-300 rounded-md p-2"
              {...register("role", { required: true })}
              defaultValue="2"
            >
              <option value="1">Admin</option>
              <option value="2">Común</option>
            </select>
          </div>
        </div>

        <div className="w-full">
          <button
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
            type="submit"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}

export { CreateUser };
