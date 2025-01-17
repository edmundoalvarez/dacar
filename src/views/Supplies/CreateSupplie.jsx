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
        <div className="pb-8 px-16 bg-gray-100 min-h-screen">
            <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                <h1 className="text-4xl font-semibold text-white">
                    Crear Insumo
                </h1>
                <div className="flex items-center gap-4">
                    <Link
                        to={`/ver-insumos`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
                    >
                        <img
                            src="./icon_back.svg"
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
                            src="./icon_home.svg"
                            alt="Icono de budgets"
                            className="w-[20px]"
                        />
                        <p className="m-0 leading-loose">Ir a Inicio</p>
                    </Link>
                </div>
            </div>
            <form
                action=""
                className="w-full max-w-4xl m-auto p-12 rounded-lg bg-white shadow-sm"
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <div className="flex justify-between gap-4">
                    <div className="w-1/3">
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="name"
                                className="text-gray-700 font-medium"
                            >
                                Nombre del insumo
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                            <label
                                htmlFor="length"
                                className="text-gray-700 font-medium"
                            >
                                Largo
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="price"
                                className="text-gray-700 font-medium"
                            >
                                Precio
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                    <div className="w-1/3">
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="category"
                                className="text-gray-700 font-medium"
                            >
                                Categoria
                            </label>
                            <select
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                                    <option
                                        key={category.name}
                                        value={category.name}
                                    >
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
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="width"
                                className="text-gray-700 font-medium"
                            >
                                Ancho
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                    </div>
                    <div className="w-1/3">
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="material"
                                className="text-gray-700 font-medium"
                            >
                                Material
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                        <div className="flex flex-col my-4">
                            <label
                                htmlFor="thickness"
                                className="text-gray-700 font-medium"
                            >
                                Grosor
                            </label>
                            <input
                                className="border border-gray-300 rounded-md px-4 py-2 mt-1  w-full transition duration-200"
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
                    </div>
                </div>
                <button
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
                    type="submit"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}

export { CreateSupplie };
