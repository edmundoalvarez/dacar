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
            <div className="pb-8 px-16 bg-gray-100 min-h-screen">
                <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                    <h1 className="text-4xl font-semibold text-white">
                        Editar Cliente
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/ver-clientes`}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
                        >
                            <img
                                src="./../icon_back.svg"
                                alt="Icono de budgets"
                                className="w-[18px]"
                            />
                            <p className="m-0 leading-loose">Volver</p>
                        </Link>
                        <Link
                            to="/"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
                        >
                            <img
                                src="./../icon_home.svg"
                                alt="Icono de budgets"
                                className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">Ir a Inicio</p>
                        </Link>
                    </div>
                </div>
                <form
                    action=""
                    className="flex flex-row flex-wrap gap-2 w-full max-w-5xl m-auto p-12 rounded-lg bg-white shadow-sm text-gray-700"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-row w-full gap-6 ">
                        <div className="flex flex-col w-1/2 ">
                            <label className="font-medium" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                        <div className="flex flex-col w-1/2 ">
                            <label className="font-medium" htmlFor="lastname">
                                Apellido
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                    </div>
                    <div className="flex flex-row w-full gap-6 ">
                        <div className="flex flex-col w-1/2 ">
                            <label className="font-medium" htmlFor="phone">
                                Teléfono
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                        <div className="flex flex-col w-1/2 ">
                            <label className="font-medium" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                    </div>
                    <div className="flex flex-row w-full gap-6 ">
                        <div className="flex flex-col w-1/2 ">
                            <label className="font-medium" htmlFor="dni">
                                DNI
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                        <div className="flex flex-col w-1/2 ">
                            <label htmlFor="cuil_cuit">CUIT/CUIL</label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                    </div>
                    <div className="flex flex-col w-full my-2">
                        <label className="font-medium" htmlFor="address">
                            Dirección
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2"
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
                    <div className="w-full">
                        <button
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
                            type="submit"
                        >
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export { EditClient };
