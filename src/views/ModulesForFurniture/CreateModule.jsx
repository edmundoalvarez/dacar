import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    createModule,
    FormCreatePieces,
    FormAddSupplies,
    createPieces,
    getAllTables,
    getAllSuppliesExceptTables,
} from "../../index.js";

function CreateModule() {
    const navigation = useNavigate();
    const [piecesCount, setPiecesCount] = useState(0);
    const [suppliesCount, setSuppliesCount] = useState(0);
    const [tables, setTables] = useState([]);
    const [supplies, setSupplies] = useState([]);

    // TRAER PLACAS: para el formulario de las piezas, se le pasar por prop
    const getAllTablesToSet = () => {
        getAllTables()
            .then((tablesData) => {
                setTables(tablesData.data);
                // console.log(tablesData.data);
            })
            .catch((error) => {
                console.error("Este es el error:", error);
            });
    };

    // TRAER INSUMOS: para el formulario de insumos, se le pasar por prop
    const getAllSuppliesToSet = () => {
        getAllSuppliesExceptTables()
            .then((supplieData) => {
                setSupplies(supplieData.data);
                // console.log(supplieData.data);
            })
            .catch((error) => {
                console.error("Este es el error:", error);
            });
    };

    // FORMULARIO PARA CREAR
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data, event) => {
        event.preventDefault();
        try {
            // Crear el módulo y obtener el ID del módulo creado
            const { name, length, width, material, description } = data; // Extraer datos relevantes para el módulo
            console.log("data del form", data);
            const supplies_module = [...Array(suppliesCount)].map(
                (_, index) => {
                    const supplyIdName = data[`supplie_id_name${index}`];
                    const [supplie_id, supplie_name] = supplyIdName.split("##");

                    return {
                        supplie_id,
                        supplie_name,
                        supplie_qty: data[`supplie_qty${index}`],
                        supplie_length: data[`supplie_length${index}`],
                    };
                }
            );
            let piecesNumber = 0;
            for (let i = 0; i < piecesCount; i++) {
                const qty =
                    data[`qty${i}`] !== undefined &&
                    data[`qty${i}`] !== "" &&
                    Number(data[`qty${i}`]) !== 0
                        ? Number(data[`qty${i}`])
                        : 1;

                piecesNumber += qty;
            }

            const moduleData = {
                name,
                length,
                width,
                height: data.height,
                material,
                description,
                pieces_number: piecesNumber,
                supplies_module, // Asignar el array de insumos
            }; // Crear objeto moduleData con los datos del módulo
            const moduleId = await createModule(moduleData);
            console.log("¡Creaste el módulo con éxito!");

            // Crear las piezas asociadas al módulo
            for (let i = 0; i < piecesCount; i++) {
                let lacqueredPiece;
                let veneer;
                let veneer2;
                let melamine;
                if (data[`finishing${i}`] === "lacqueredPiece") {
                    lacqueredPiece = true;
                    veneer = false;
                    veneer2 = false;
                    melamine = false;
                }
                if (data[`finishing${i}`] === "veneer") {
                    lacqueredPiece = false;
                    veneer = true;
                    veneer2 = false;
                    melamine = false;
                }
                if (data[`finishing${i}`] === "veneer2") {
                    lacqueredPiece = false;
                    veneer = false;
                    veneer2 = true;
                    melamine = false;
                }
                if (data[`finishing${i}`] === "melamine") {
                    lacqueredPiece = false;
                    veneer = false;
                    veneer2 = false;
                    melamine = true;
                }

                const qty =
                    data[`qty${i}`] !== undefined &&
                    data[`qty${i}`] !== "" &&
                    Number(data[`qty${i}`]) !== 0
                        ? Number(data[`qty${i}`])
                        : 1;

                let lacqueredEdge = false;
                let polishedEdge = false;

                if (data[`edgeType${i}`] === "lacquered") {
                    lacqueredEdge = true;
                }

                if (data[`edgeType${i}`] === "polished") {
                    polishedEdge = true;
                }

                const pieceData = {
                    // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
                    name: data[`namePiece${i}`],
                    qty,
                    length: data[`lengthPiece${i}`],
                    width: data[`widthPiece${i}`],
                    orientation: data[`orientation${i}`],
                    comment: data[`commentPiece${i}`],
                    material: data[`materialPiece${i}`],
                    lacqueredPiece: lacqueredPiece,
                    lacqueredPieceSides: data[`lacqueredPieceSides${i}`]
                        ? Number(data[`lacqueredPieceSides${i}`])
                        : undefined,
                    veneer: veneer,
                    veneerFinishing: data[`veneerOption${i}`],
                    veneerLacqueredPieceSides: data[
                        `veneerLacqueredPieceSides${i}`
                    ]
                        ? Number(data[`veneerLacqueredPieceSides${i}`])
                        : undefined,
                    veneer2: veneer2,
                    veneer2Finishing: data[`veneer2Option${i}`],
                    veneer2LacqueredPieceSides: data[
                        `veneer2LacqueredPieceSides${i}`
                    ]
                        ? Number(data[`veneer2LacqueredPieceSides${i}`])
                        : undefined,
                    melamine: melamine,
                    melamineLacquered: data[`melamineLacquered${i}`],
                    melamineLacqueredPieceSides: data[
                        `melamineLacqueredPieceSides${i}`
                    ]
                        ? Number(data[`melamineLacqueredPieceSides${i}`])
                        : undefined,
                    pantographed: data[`pantographed${i}`],
                    edgeLength: data[`edgeLength${i}`],
                    edgeLengthSides: data[`edgeLengthSides${i}`]
                        ? Number(data[`edgeLengthSides${i}`])
                        : undefined,
                    edgeWidth: data[`edgeWidth${i}`],
                    edgeWidthSides: data[`edgeWidthSides${i}`]
                        ? Number(data[`edgeWidthSides${i}`])
                        : undefined,
                    lacqueredEdge: lacqueredEdge,
                    polishedEdge: polishedEdge,
                    loose_piece: data[`loose_piece${i}`],
                    moduleId, // Asigna el ID del módulo a cada pieza
                };
                await createPieces(pieceData);
            }

            navigation(`/ver-modulos`);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePiecesCountChange = (e) => {
        setPiecesCount(Number(e.target.value));
    };

    const handleSuppliesCountChange = (e) => {
        setSuppliesCount(Number(e.target.value));
    };

    // traer las placas e insumos
    useEffect(() => {
        getAllTablesToSet();
        getAllSuppliesToSet();
    }, []);

    return (
        <div className="pb-8 px-16 bg-gray-100 min-h-screen">
            <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                <h1 className="text-4xl font-semibold text-white">
                    Crear Módulo
                </h1>
                <div className="flex items-center gap-4">
                    <Link
                        to={`/ver-modulos`}
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
                className="flex flex-row flex-wrap gap-2 w-full max-w-5xl m-auto p-12 rounded-lg bg-white shadow-sm text-gray-700"
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <div className="flex flex-col w-full ">
                    <label className="font-medium" htmlFor="name">
                        Nombre del módulo
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
                <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col w-1/4 my-2">
                        <label className="font-medium" htmlFor="length">
                            Largo
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2"
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
                    <div className="flex flex-col w-1/4 my-2">
                        <label className="font-medium" htmlFor="height">
                            Alto
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2"
                            type="text"
                            name="height"
                            id="height"
                            {...register("height", {
                                required: "El campo es obligatorio",
                            })}
                        />
                        {errors.height && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.height.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/4 my-2">
                        <label className="font-medium" htmlFor="width">
                            Profundidad
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2"
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
                    <div className="flex flex-col w-1/4 my-2">
                        <label
                            className="font-semibold mb-1"
                            htmlFor="material"
                        >
                            Material
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2"
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
                </div>

                <div className="flex flex-col w-full">
                    <label className="font-semibold mb-1" htmlFor="description">
                        Descripción
                    </label>
                    <textarea
                        className="border border-gray-300 rounded-md p-2 h-[100px] "
                        type="text"
                        name="description"
                        id="description"
                        {...register("description", {
                            required: "El campo es obligatorio",
                        })}
                    />
                    {errors.description && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col w-full my-8 pt-8 border-t-2 border-t-emerald-600">
                    <h2 className="text-xl font-bold">Insumos</h2>
                    <label
                        className="font-semibold mb-1"
                        htmlFor="suppliesNumber"
                    >
                        Cantidad de insumos
                    </label>
                    <input
                        className="border border-gray-300 rounded-md p-2 "
                        type="number"
                        name="suppliesNumber"
                        id="suppliesNumber"
                        {...register("suppliesNumber")}
                        onChange={handleSuppliesCountChange}
                        min="0"
                    />
                    {errors.suppliesNumber && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.suppliesNumber.message}
                        </span>
                    )}
                </div>

                {[...Array(suppliesCount)].map((_, index) => (
                    <FormAddSupplies
                        key={index}
                        register={register}
                        index={index}
                        errors={errors}
                        supplies={supplies}
                    />
                ))}
                <div className="flex flex-col w-full my-8 pt-8 border-t-2 border-t-emerald-600">
                    <h2 className="text-xl font-bold">Piezas</h2>
                    <div className="flex flex-col w-full mt-2 mb-6">
                        <label
                            className="font-semibold mb-1"
                            htmlFor="piecesNumber"
                        >
                            Cantidad de piezas
                        </label>
                        <input
                            className="border border-gray-300 rounded-md p-2 "
                            type="number"
                            name="piecesNumber"
                            id="piecesNumber"
                            {...register("piecesNumber", {
                                required: "El campo es obligatorio",
                            })}
                            onChange={handlePiecesCountChange}
                            min="0"
                        />
                        {errors.piecesNumber && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.piecesNumber.message}
                            </span>
                        )}
                    </div>

                    {[...Array(piecesCount)].map((_, index) => (
                        <FormCreatePieces
                            key={`FormCreatePiecess${index}`}
                            register={register}
                            index={index}
                            errors={errors}
                            tables={tables}
                            resetField={resetField}
                        />
                    ))}
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
    );
}

export { CreateModule };
