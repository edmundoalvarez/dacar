import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    FormEditPieces,
    FormEditSupplies,
    getAllTables,
    getAllSuppliesExceptTables,
    getModuleAndPiecesByModuleId,
    updateModule,
    updatePiece,
} from "../../index.js";

function EditModule() {
    const { idModule } = useParams(); // Obtener los ID del mueble y del módulo desde la URL
    const navigate = useNavigate();
    const [piecesCount, setPiecesCount] = useState(0);
    const [suppliesCount, setSuppliesCount] = useState(0);
    const [tables, setTables] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [currentModule, setCurrentModule] = useState(null); // Estado para almacenar el módulo actual
    const [moduleOriginalHeight, setModuleOriginalHeight] = useState(null);
    const [moduleOriginalLength, setModuleOriginalLength] = useState(null);
    const [moduleOriginalWidth, setModuleOriginalWidth] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        resetField,
        formState: { errors },
    } = useForm();

    // Obtener datos del mueble por ID
    const getModuleData = () => {
        getModuleAndPiecesByModuleId(idModule)
            .then((moduleData) => {
                const module = moduleData;
                setCurrentModule(module); // Guardar el módulo en el estado
                // Rellenar el formulario con los datos del módulo
                setModuleOriginalHeight(module.height || 0);
                setModuleOriginalLength(module.length || 0);
                setModuleOriginalWidth(module.width || 0);
                setPiecesCount(module.pieces.length || 0);
                setSuppliesCount(module.supplies_module.length || 0);
                reset(module);

                // Establecer valores iniciales para insumos y piezas
                module.supplies_module.forEach((supply, index) => {
                    setValue(
                        `supplie_id_name${index}`,
                        `${supply.supplie_id}-${supply.supplie_name}`
                    );
                    setValue(`supplie_qty${index}`, supply.supplie_qty);
                    setValue(`supplie_length${index}`, supply.supplie_length);
                });

                module.pieces.forEach((piece, index) => {
                    setValue(`pieceId${index}`, piece._id);
                    setValue(`namePiece${index}`, piece.name);
                    setValue(`qty${index}`, piece.qty);
                    setValue(`lengthPiece${index}`, piece.length);
                    setValue(`widthPiece${index}`, piece.width);
                    setValue(`orientation${index}`, piece.orientation);
                    setValue(`commentPiece${index}`, piece.comment);
                    setValue(`materialPiece${index}`, piece.material);
                    setValue(`lacqueredPiece${index}`, piece.lacqueredPiece);
                    setValue(
                        `lacqueredPieceSides${index}`,
                        piece.lacqueredPieceSides
                    );
                    setValue(`veneer${index}`, piece.veneer);
                    setValue(`veneerOption${index}`, piece.veneerFinishing);
                    setValue(
                        `veneerLacqueredPieceSides${index}`,
                        piece.veneerLacqueredPieceSides
                    );
                    setValue(`veneer2${index}`, piece.veneer2);
                    setValue(`veneer2Option${index}`, piece.veneer2Finishing);
                    setValue(
                        `veneer2LacqueredPieceSides${index}`,
                        piece.veneer2LacqueredPieceSides
                    );
                    setValue(`melamine${index}`, piece.melamine);
                    setValue(
                        `melamineLacquered${index}`,
                        piece.melamineLacquered
                    );
                    setValue(
                        `melamineLacqueredPieceSides${index}`,
                        piece.melamineLacqueredPieceSides
                    );
                    setValue(`pantographed${index}`, piece.pantographed);
                    setValue(`edgeLength${index}`, piece.edgeLength);
                    setValue(`edgeLengthSides${index}`, piece.edgeLengthSides);
                    setValue(`edgeWidth${index}`, piece.edgeWidth);
                    setValue(`edgeWidthSides${index}`, piece.edgeWidthSides);
                    if (piece.lacqueredEdge) {
                        setValue(`edgeType${index}`, "lacquered");
                    }
                    if (piece.polishedEdge) {
                        setValue(`edgeType${index}`, "polished");
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching module data:", error);
            });
    };

    // TRAER PLACAS: para el formulario de las piezas, se le pasar por prop
    const getAllTablesToSet = () => {
        getAllTables()
            .then((tablesData) => {
                setTables(tablesData.data);
            })
            .catch((error) => {
                console.error("Error fetching tables:", error);
            });
    };

    // TRAER INSUMOS: para el formulario de insumos, se le pasar por prop
    const getAllSuppliesToSet = () => {
        getAllSuppliesExceptTables()
            .then((supplieData) => {
                setSupplies(supplieData.data);
            })
            .catch((error) => {
                console.error("Error fetching supplies:", error);
            });
    };

    //AGREGAR MAS INSUMOS

    const handleSuppliesCountChange = (e) => {
        setSuppliesCount(Number(e.target.value));
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();

        try {
            const { name, height, length, width, material, description } = data;

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

            const pieces = [...Array(piecesCount)].map((_, index) => {
                console.log("qty", data[`qty${index}`]);
                let qty =
                    data[`qty${index}`] !== undefined &&
                    data[`qty${index}`] !== "" &&
                    Number(data[`qty${index}`]) !== 0
                        ? Number(data[`qty${index}`])
                        : 1;

                piecesNumber += qty;
                let lacqueredPiece;
                let veneer;
                let veneer2;
                let melamine;
                if (data[`finishing${index}`] === "lacqueredPiece") {
                    lacqueredPiece = true;
                    veneer = false;
                    veneer2 = false;
                    melamine = false;
                }
                if (data[`finishing${index}`] === "veneer") {
                    lacqueredPiece = false;
                    veneer = true;
                    veneer2 = false;
                    melamine = false;
                }
                if (data[`finishing${index}`] === "veneer2") {
                    lacqueredPiece = false;
                    veneer = false;
                    veneer2 = true;
                    melamine = false;
                }
                if (data[`finishing${index}`] === "melamine") {
                    lacqueredPiece = false;
                    veneer = false;
                    veneer2 = false;
                    melamine = true;
                }

                let lacqueredEdge = false;
                let polishedEdge = false;

                if (data[`edgeType${index}`] === "lacquered") {
                    lacqueredEdge = true;
                }

                if (data[`edgeType${index}`] === "polished") {
                    polishedEdge = true;
                }

                //  parseFloat(pieceLength.toFixed(2));
                return {
                    _id: data[`pieceId${index}`],
                    name: data[`namePiece${index}`],
                    qty: qty,
                    length: parseFloat(data[`lengthPiece${index}`]),
                    width: parseFloat(data[`widthPiece${index}`]),
                    orientation: data[`orientation${index}`],
                    comment: data[`commentPiece${index}`],
                    material: data[`materialPiece${index}`],
                    lacqueredPiece: lacqueredPiece,
                    lacqueredPieceSides: data[`lacqueredPieceSides${index}`]
                        ? Number(data[`lacqueredPieceSides${index}`])
                        : undefined,
                    veneer: veneer,
                    veneerFinishing: data[`veneerOption${index}`],
                    veneerLacqueredPieceSides: data[
                        `veneerLacqueredPieceSides${index}`
                    ]
                        ? Number(data[`veneerLacqueredPieceSides${index}`])
                        : undefined,
                    veneer2: veneer2,
                    veneer2Finishing: data[`veneer2Option${index}`],
                    veneer2LacqueredPieceSides: data[
                        `veneer2LacqueredPieceSides${index}`
                    ]
                        ? Number(data[`veneer2LacqueredPieceSides${index}`])
                        : undefined,
                    melamine: melamine,
                    melamineLacquered: data[`melamineLacquered${index}`],
                    melamineLacqueredPieceSides: Number(
                        data[`melamineLacqueredPieceSides${index}`]
                    )
                        ? Number(data[`melamineLacqueredPieceSides${index}`])
                        : undefined,
                    pantographed: data[`pantographed${index}`],
                    edgeLength: data[`edgeLength${index}`],
                    edgeLengthSides: data[`edgeLengthSides${index}`]
                        ? Number(data[`edgeLengthSides${index}`])
                        : undefined,
                    edgeWidth: data[`edgeWidth${index}`],
                    edgeWidthSides: data[`edgeWidthSides${index}`]
                        ? Number(data[`edgeWidthSides${index}`])
                        : undefined,
                    lacqueredEdge: lacqueredEdge,
                    polishedEdge: polishedEdge,
                    loose_piece: data[`loose_piece${index}`]
                        ? Number(data[`loose_piece${index}`])
                        : undefined,
                    module_id: idModule,
                };
            });

            const updatedModule = {
                name,
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height),
                material,
                description,
                pieces_number: piecesNumber,
                supplies_module,
            };
            // console.log("updatedModule", updatedModule);
            // console.log("pieces", pieces);
            await updateModule(idModule, updatedModule);
            pieces.forEach((piece) => {
                updatePiece(piece._id, piece);
            });
            navigate(`/ver-modulos`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllTablesToSet();
        getAllSuppliesToSet();
        getModuleData(); // Llamar a la función para obtener los datos del mueble y módulo
    }, []);

    //Funcion para actualizar las dimensiones de las piezas al cambiar la medida del modulo
    const handleModuleChange = (e) => {
        const { name, value } = e.target;
        let moduleNewHeight;
        let moduleNewLength;
        let moduleNewWidth;

        moduleNewHeight = Number(getValues("height"));

        moduleNewLength = Number(getValues("length"));

        moduleNewWidth = Number(getValues("width"));

        currentModule.pieces.map((piece, index) => {
            const orientation = getValues(`orientation${index}`);

            const formattedModuleNewHeight =
                moduleNewHeight ?? moduleOriginalHeight;
            const formattedModuleNewLength =
                moduleNewLength ?? moduleOriginalLength;
            const formattedModuleNewWidth =
                moduleNewWidth ?? moduleOriginalWidth;

            // setModuleOriginalHeight(formattedModuleNewHeight);
            // setModuleOriginalLength(formattedModuleNewLength);
            // setModuleOriginalWidth(formattedModuleNewWidth);
            let pieceLength = getValues(`lengthPieceHidden${index}`);
            let pieceWidth = getValues(`widthPieceHidden${index}`);
            pieceLength = Number(pieceLength);
            pieceWidth = Number(pieceWidth);

            /* transversal vertical */
            if (orientation === "cross-vertical") {
                if (formattedModuleNewHeight >= moduleOriginalHeight) {
                    pieceLength =
                        pieceLength +
                        (formattedModuleNewHeight - moduleOriginalHeight) *
                            (pieceLength / moduleOriginalHeight);
                }
                if (formattedModuleNewHeight < moduleOriginalHeight) {
                    pieceLength =
                        pieceLength -
                        (moduleOriginalHeight - formattedModuleNewHeight) *
                            (pieceLength / moduleOriginalHeight);
                }

                if (formattedModuleNewLength >= moduleOriginalLength) {
                    pieceWidth =
                        pieceWidth +
                        (formattedModuleNewLength - moduleOriginalLength) *
                            (pieceWidth / moduleOriginalLength);
                }
                if (formattedModuleNewLength < moduleOriginalLength) {
                    pieceWidth =
                        pieceWidth -
                        (moduleOriginalLength - formattedModuleNewLength) *
                            (pieceWidth / moduleOriginalLength);
                }
            }
            /* tranversal horizontal */
            if (orientation === "cross-horizontal") {
                if (formattedModuleNewLength >= moduleOriginalLength) {
                    pieceLength =
                        pieceLength +
                        (formattedModuleNewLength - moduleOriginalLength) *
                            (pieceLength / moduleOriginalLength);
                }
                if (formattedModuleNewLength < moduleOriginalLength) {
                    pieceLength =
                        pieceLength -
                        (moduleOriginalLength - formattedModuleNewLength) *
                            (pieceLength / moduleOriginalLength);
                }
                if (formattedModuleNewWidth >= moduleOriginalWidth) {
                    pieceWidth =
                        pieceWidth +
                        (formattedModuleNewWidth - moduleOriginalWidth) *
                            (pieceWidth / moduleOriginalWidth);
                }
                if (formattedModuleNewWidth < moduleOriginalWidth) {
                    pieceWidth =
                        pieceWidth -
                        (moduleOriginalWidth - formattedModuleNewWidth) *
                            (pieceWidth / moduleOriginalWidth);
                }
            }

            /* lateral */
            if (orientation === "side") {
                if (formattedModuleNewHeight >= moduleOriginalHeight) {
                    pieceLength =
                        pieceLength +
                        (formattedModuleNewHeight - moduleOriginalHeight) *
                            (pieceLength / moduleOriginalHeight);
                }
                if (formattedModuleNewHeight < moduleOriginalHeight) {
                    pieceLength =
                        pieceLength -
                        (moduleOriginalHeight - formattedModuleNewHeight) *
                            (pieceLength / moduleOriginalHeight);
                }
                if (formattedModuleNewWidth >= moduleOriginalWidth) {
                    pieceWidth =
                        pieceWidth +
                        (formattedModuleNewWidth - moduleOriginalWidth) *
                            (pieceWidth / moduleOriginalWidth);
                }
                if (formattedModuleNewWidth < moduleOriginalWidth) {
                    pieceWidth =
                        pieceWidth -
                        (moduleOriginalWidth - formattedModuleNewWidth) *
                            (pieceWidth / moduleOriginalWidth);
                }
            }
            const formatNumber = (num) => {
                // Redondear a 2 decimales
                const rounded = num.toFixed(2);

                // Convertir de vuelta a número
                const number = Number(rounded);

                // Verificar si el número redondeado es igual al número original
                if (number === num) {
                    return number; // Si es redondo, devolver sin decimales extra
                }

                return rounded; // Si no es redondo, devolver con 2 decimales
            };
            setValue(`lengthPiece${index}`, formatNumber(pieceLength));
            setValue(`widthPiece${index}`, formatNumber(pieceWidth));
        });
    };

    return (
        <div className="pb-8 px-16 bg-gray-100 min-h-screen">
            <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                <h1 className="text-4xl font-semibold text-white">
                    Editar Módulo
                </h1>
                <div className="flex items-center gap-4">
                    <Link
                        to={`/ver-modulos`}
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
                    <Link
                        to={`/ver-modulos/${idModule}/piezas`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
                    >
                        <img
                            src="./../icon_add.svg"
                            alt="Icono de budgets"
                            className="w-[20px]"
                        />
                        <p className="m-0 leading-loose">
                            Agregar o eliminar piezas
                        </p>
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
                    <label htmlFor="name" className="font-semibold mb-1">
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
                            onBlur={handleModuleChange}
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
                            onBlur={handleModuleChange}
                        />
                        {errors.height && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.height.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/4 my-2">
                        <label htmlFor="width" className="font-semibold mb-1">
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
                            onBlur={handleModuleChange}
                        />
                        {errors.width && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.width.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/4 my-2">
                        <label
                            htmlFor="material"
                            className="font-semibold mb-1"
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
                        Description
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

                <div className="flex flex-col w-full my-8 pt-8 border-t border-t-emerald-600">
                    <h2 className="text-xl font-bold">Insumos</h2>
                    <label
                        htmlFor="suppliesNumber"
                        className="font-semibold mb-1"
                    >
                        Cantidad de insumos
                    </label>
                    <input
                        className="border border-gray-300 rounded-md p-2 "
                        type="number"
                        name="suppliesNumber"
                        id="suppliesNumber"
                        {...register("suppliesNumber")}
                        value={suppliesCount}
                        onChange={handleSuppliesCountChange}
                        min="0"
                    />
                    {errors.suppliesNumber && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.suppliesNumber.message}
                        </span>
                    )}
                </div>

                {currentModule &&
                    [...Array(suppliesCount)].map((_, index) => (
                        <FormEditSupplies
                            key={`supplies-${index}`}
                            register={register}
                            index={index}
                            errors={errors}
                            supplies={supplies}
                            supplyModule={currentModule.supplies_module[index]}
                            setValue={setValue} // Asegúrate de pasar setValue aquí también
                        />
                    ))}
                <div className="flex flex-col w-full my-8 pt-8 border-t border-t-emerald-600">
                    <h2 className="text-xl font-bold">Piezas</h2>
                    <div className="flex flex-col w-full mt-2 mb-6">
                        <label
                            htmlFor="piecesNumber"
                            className="font-semibold mb-1"
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
                            value={piecesCount}
                            readOnly
                        />
                        {errors.piecesNumber && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors.piecesNumber.message}
                            </span>
                        )}
                    </div>

                    {currentModule &&
                        [...Array(piecesCount)].map((_, index) => (
                            <FormEditPieces
                                key={`pieces-${index}`}
                                register={register}
                                index={index}
                                errors={errors}
                                tables={tables}
                                resetField={resetField}
                                setValue={setValue} // Pasa setValue aquí también
                                piece={currentModule.pieces[index]}
                            />
                        ))}
                    <div className="w-full">
                        <button
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
                            type="submit"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export { EditModule };
