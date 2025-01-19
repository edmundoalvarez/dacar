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
            <div className="pb-8 px-16 bg-gray-100 min-h-screen">
                <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                    <h1 className="text-4xl font-semibold text-white">
                        Editar Servicio
                    </h1>

                    <div className="flex items-center gap-4">
                        <Link
                            to={`/ver-servicios`}
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
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
                        >
                            <img
                                src="./../icon_home.svg"
                                alt="Icono de budgets"
                                className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">Ir al Inicio</p>
                        </Link>
                    </div>
                </div>
                <form
                    action=""
                    className="flex flex-row flex-wrap gap-2 w-full max-w-5xl m-auto p-12 rounded-lg bg-white shadow-sm text-gray-700"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-full flex flex-row gap-6">
                        <div className="flex flex-col w-1/2 ">
                            <label htmlFor="name" className="font-medium">
                                Nombre del servicio
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
                            <label htmlFor="price" className="font-medium">
                                Precio
                            </label>
                            <input
                                className="border border-gray-300 rounded-md p-2"
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
                    <div className="w-full">
                        <button
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
                            type="submit"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export { EditService };
