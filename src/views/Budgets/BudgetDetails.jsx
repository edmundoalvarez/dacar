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
                        <div className="text-center w-[280px] m-auto mt-4 mb-6">
                            <img
                                className=""
                                src="./../logo-dacar.png"
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
                                    {budget.deliver_date}
                                </p>
                            </div>
                        </div>

                        <table className="min-w-full mb-4 border border-gray-700">
                            <thead className="bg-[#9C846A]">
                                <tr>
                                    <th className="px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider">
                                        ITEM
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider border-r border-r-black border-l border-l-black">
                                        DESCRIPCIÓN
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-light text-white uppercase tracking-wider">
                                        TOTAL
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 border border-gray-700">
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
                                                    <p className="mb-6">
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
                                                                {furn.height}{" "}
                                                                (alto) x{" "}
                                                                {furn.length}{" "}
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
                                                        <p className="mb-2">
                                                            Incluye los
                                                            siguientes{" "}
                                                            <span className="font-bold">
                                                                MÓDULOS:
                                                            </span>
                                                        </p>

                                                        <ul className="mb-6">
                                                            {furn.modules_furniture.map(
                                                                (
                                                                    module,
                                                                    idx
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
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
                                                                        (largo)
                                                                        x{" "}
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
                                                <p className="mb-2">
                                                    <span className="font-bold">
                                                        Comentarios:
                                                    </span>
                                                </p>
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
                            </tbody>
                        </table>

                        <div className="bg-white text-[#726352] uppercase flex flex-col border border-gray-700">
                            <div className="flex flex-row border-t border-x border-gray-200">
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">
                                    ENVÍO
                                </p>
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                                    {budget.shipment == true
                                        ? "Incluido"
                                        : "No Incluido"}
                                </p>
                            </div>
                            <div className="flex flex-row border-t border-x border-gray-200">
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">
                                    COLOCACIÓN
                                </p>
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                                    {budget.placement == true
                                        ? "Incluido"
                                        : "No Incluido"}
                                </p>
                            </div>
                            <div className="flex flex-row border-t border-x border-gray-200">
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">
                                    FORMA DE PAGO
                                </p>
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                                    50% de seña y 50% a contraentrega
                                </p>
                            </div>
                            <div className="flex flex-row border-t border-x border-gray-200">
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">
                                    MEDIO DE PAGO
                                </p>
                                <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                                    Transferencia, Depósito, Efectivo
                                </p>
                            </div>
                            <div className="border-t border-x border-gray-200">
                                <p className="px-4 py-2 whitespace-nowrap text-sm text-center">
                                    *EL SALDO DEL SIGUIENTE PRESUPUESTO ESTARÁ
                                    DOLARIZADO SEGÚN COTIZACIÓN AL DÍA DE LA
                                    SEÑA
                                </p>
                            </div>
                        </div>
                        <div className="border-t-4  border-t-[#9C846A] border-b-4  border-b-[#9C846A] pt-6 mt-6 pb-6">
                            <div className="w-full flex flex-col ">
                                <table>
                                    <tbody>
                                        <tr className="bg-[#9C846A] text-white border border-gray-700">
                                            <td className="px-6 text-md py-2 border-r border-gray-600 w-[200px]">
                                                SUBTOTAL:
                                            </td>
                                            <td className="px-6 text-md py-2 w-[200px] text-right">
                                                {formatCurrency(
                                                    totalPriceInUnits
                                                )}
                                            </td>
                                        </tr>
                                        <tr className="bg-white border border-gray-700">
                                            <td className="px-6 text-md py-2 border-r border-gray-600 w-[200px]">
                                                IVA 21%:
                                            </td>
                                            <td className="px-6 text-md py-2 text-black w-[200px] text-right">
                                                {formatCurrency(iva)}
                                            </td>
                                        </tr>
                                        <tr className="bg-[#9C846A] text-white font-bold border border-gray-700 w-[200px]">
                                            <td className="px-6 text-md py-2 border-r border-gray-600">
                                                TOTAL:
                                            </td>
                                            <td className="px-6 text-md py-2 w-[200px] text-right">
                                                {formatCurrency(total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-6 text-center text-sm text-[#726352]">
                                DOCUMENTO NO VALIDO COMO FACTURA. PRESUPUESTO
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
