import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBudgetById } from "../../index.js";
import { Grid } from "react-loader-spinner";
function BudgetDetails() {
    const [budget, setBudget] = useState({});
    const [loader, setLoader] = useState(true);
    const { idBudget } = useParams();

    const getBudgetToSet = () => {
        getBudgetById(idBudget)
            .then((budgetData) => {
                setBudget(budgetData.data);
                setLoader(false);
            })
            .catch((error) => {
                console.error("Este es el error:", error);
            });
    };

    useEffect(() => {
        getBudgetToSet();
    }, [idBudget]);

    const totalPriceInUnits = budget.total_price;
    const iva = totalPriceInUnits * 0.21;
    const total = totalPriceInUnits + iva;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <div className="pb-8 px-16 bg-white min-h-screen">
                <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
                    <h1 className="text-4xl font-semibold text-white">
                        Detalle del presupuesto
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/ver-presupuestos`}
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
                {loader ? (
                    <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
                        <Grid
                            visible={loader}
                            height="80"
                            width="80"
                            color="rgb(92, 92, 92)"
                            ariaLabel="grid-loading"
                            radius="12.5"
                            wrapperStyle={{}}
                            wrapperClass="grid-wrapper"
                        />
                    </div>
                ) : (
                    <div className="border border-gray-300 p-8 shadow-lg rounded-lg max-w-6xl m-auto">
                        <div className="text-center w-[240px] m-auto mt-4 mb-6">
                            <img
                                className=""
                                src="./../logo-dacar.svg"
                                alt="Logo Dacar"
                            />
                        </div>
                        <div className="flex flex-row justify-between ">
                            <h2 className="w-[300px] text-lg font-light text-[#726352]">
                                CARPINTERIA GENERAL DE OBRA EQUIPAMIENTOS A
                                MEDIDA
                            </h2>
                            <ul className="text-[#726352] font-light text-right text-lg">
                                <li>MERCEDES 3280, SAN ANDRES - BS.AS.</li>
                                <li>OFICINA: 2198.3323</li>
                                <li>WHATSAPP: 11.5019.9244</li>
                            </ul>
                        </div>
                        <div className="flex justify-between mb-4 py-4 mt-4 border-t-4  border-t-[#9C846A] border-b-4  border-b-[#9C846A]">
                            <div className="flex flex-col gap-0">
                                <p className="text-gray-600">
                                    <span className="font-bold">CLIENTE:</span>{" "}
                                    {budget.client?.[0]?.name}{" "}
                                    {budget.client?.[0]?.lastname}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">OBRA:</span>{" "}
                                    {budget.furniture_name}
                                </p>
                            </div>

                            <div className="flex flex-col gap-0">
                                <p className="text-gray-600">
                                    <span className="font-bold">FECHA:</span>{" "}
                                    {new Date(budget.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">
                                        PRESUPUESTO:
                                    </span>{" "}
                                    {budget.budget_number}
                                </p>
                            </div>

                            <div className="flex flex-col gap-0">
                                <p className="text-gray-600">
                                    <span className="font-bold">
                                        FECHA ESTIMADA DE ENTREGA:
                                    </span>{" "}
                                </p>
                                <p className="text-gray-600 uppercase text-right">
                                    {budget.deliver_date}
                                </p>
                            </div>
                        </div>

                        <table className="min-w-full border border-gray-700 ">
                            <thead className="bg-[#9C846A]">
                                <tr>
                                    <th className="w-1/4 px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider">
                                        ITEM
                                    </th>
                                    <th className="w-2/4 px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider border-r border-r-black border-l border-l-black">
                                        DESCRIPCIÓN
                                    </th>
                                    <th className="w-1/4 px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider">
                                        TOTAL
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border border-gray-700">
                                {budget.furniture?.map((furn, idx) => (
                                    <tr
                                        key={idx}
                                        className=" text-center border-b border-gray-700"
                                    >
                                        <td className="px-2 py-4 whitespace-nowrap text-sm align-top text-gray-700 ">
                                            {furn.name}
                                        </td>
                                        <td className="px-2 py-4 text-center whitespace-nowrap text-sm align-top text-gray-700 border-r border-r-black border-l border-l-black">
                                            <div className="w-fit max-w-[500px] m-auto text-left">
                                                <p className="mb-2 break-words whitespace-normal">
                                                    {budget.comments
                                                        ? budget.comments
                                                        : "- No hay comentarios -"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap text-sm align-top text-gray-700 ">
                                            {formatCurrency(totalPriceInUnits)}
                                        </td>
                                    </tr>
                                ))}
                                {budget.furniture?.map((furn, idx) => (
                                    <tr
                                        key={idx}
                                        className=" text-left whitespace-nowrap text-sm align-top text-gray-700 border-b border-gray-700"
                                    >
                                        <td colSpan={3} className="px-8 py-4">
                                            {/* <p className="mb-6">
                                                <span className="font-bold">
                                                    {furn.category
                                                        ? furn.category.toUpperCase()
                                                        : ""}
                                                </span>{" "}
                                                {console.log(
                                                    furn.width,
                                                    furn.height,
                                                    furn.length
                                                )}
                                                {furn.width &&
                                                furn.height &&
                                                furn.length ? (
                                                    <>
                                                        de {furn.width}{" "}
                                                        (ancho) x{" "}
                                                        {furn.height} (alto)
                                                        x {furn.length}{" "}
                                                        (profundidad).
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </p> */}
                                            {furn.category ||
                                            (furn.width &&
                                                furn.height &&
                                                furn.length) ? (
                                                <p className="mb-0">
                                                    <span className="font-bold">
                                                        {furn.category
                                                            ? furn.category.toUpperCase()
                                                            : ""}
                                                    </span>{" "}
                                                    {furn.width &&
                                                    furn.height &&
                                                    furn.length ? (
                                                        <>
                                                            de {furn.width}{" "}
                                                            (ancho) x{" "}
                                                            {furn.height} (alto)
                                                            x {furn.length}{" "}
                                                            (profundidad).
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </p>
                                            ) : (
                                                ""
                                            )}
                                            {budget?.show_modules ? (
                                                <>
                                                    <p className="mb-0">
                                                        <span className="font-bold">
                                                            MÓDULOS:
                                                        </span>
                                                    </p>

                                                    <ul className="mb-0">
                                                        {furn.modules_furniture.map(
                                                            (module, idx) => (
                                                                <li key={idx}>
                                                                    {
                                                                        module.name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        module.height
                                                                    }{" "}
                                                                    (alto) x{" "}
                                                                    {
                                                                        module.length
                                                                    }{" "}
                                                                    (largo) x{" "}
                                                                    {
                                                                        module.width
                                                                    }{" "}
                                                                    (profundidad)
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                <tr className=" text-center border-b border-gray-700 text-[#726352]">
                                    <td className="px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black">
                                        COLOCACIÓN
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="uppercase px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black"
                                    >
                                        {budget.placement == true
                                            ? "Incluido"
                                            : "No Incluido"}
                                    </td>
                                </tr>
                                <tr className=" text-center border-b border-gray-700 text-[#726352]">
                                    <td className="px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black">
                                        ENVÍO
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="uppercase px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black"
                                    >
                                        {budget.shipment == true
                                            ? "Incluido"
                                            : "No Incluido"}
                                    </td>
                                </tr>
                                <tr className=" text-center border-b border-gray-700 text-[#726352]">
                                    <td className="px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black">
                                        FORMA DE PAGO
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="uppercase px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black"
                                    >
                                        50% de seña y 50% a contraentrega
                                    </td>
                                </tr>
                                <tr className=" text-center border-b border-gray-700 text-[#726352]">
                                    <td className="px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black">
                                        MEDIO DE PAGO
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="uppercase px-2 py-4 text-left whitespace-nowrap text-sm align-top  border-r border-r-black border-l border-l-black"
                                    >
                                        Transferencia, Depósito, Efectivo
                                    </td>
                                </tr>
                                <tr className=" text-left whitespace-nowrap text-sm align-top text-[#726352]">
                                    <td
                                        colSpan={3}
                                        className="px-2 py-4 text-center whitespace-nowrap text-sm align-top border-r border-r-black border-l border-l-black"
                                    >
                                        *EL SALDO DEL SIGUIENTE PRESUPUESTO
                                        ESTARÁ DOLARIZADO SEGÚN COTIZACIÓN AL
                                        DÍA DE LA SEÑA
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="border-t-4  border-t-[#9C846A] border-b-4  border-b-[#9C846A] pt-6 mt-6 pb-6">
                            <div className="w-full flex flex-col ">
                                <table>
                                    <tbody>
                                        <tr className="bg-[#9C846A] text-white border border-gray-700">
                                            <td className="w-3/4 px-6 text-md py-1 border-r border-gray-600">
                                                SUBTOTAL:
                                            </td>
                                            <td className="w-1/4 px-6 text-md py-1 text-right">
                                                {formatCurrency(
                                                    totalPriceInUnits
                                                )}
                                            </td>
                                        </tr>
                                        <tr className="bg-white border border-gray-700">
                                            <td className="w-3/4 px-6 text-md py-1 border-r border-gray-600 text-[#726352]">
                                                IVA 21%:
                                            </td>
                                            <td className="w-1/4 px-6 text-md py-1 text-[#726352]  text-right">
                                                {formatCurrency(iva)}
                                            </td>
                                        </tr>
                                        <tr className="bg-[#9C846A] text-white font-bold border border-gray-700 w-[200px]">
                                            <td className="w-3/4 px-6 text-md py-1 border-r border-gray-600">
                                                TOTAL:
                                            </td>
                                            <td className="w-1/4 px-6 text-md py-1 text-right">
                                                {formatCurrency(total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-6 text-center text-sm text-[#726352]">
                                DOCUMENTO NO VÁLIDO COMO FACTURA. PRESUPUESTO
                                VALIDO POR 7 DÍAS
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export { BudgetDetails };
