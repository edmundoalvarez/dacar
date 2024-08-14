import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBudgetById } from "../../services/Budgets/getBudgetById";

function BudgetDetails() {
  const [budget, setBudget] = useState({});
  const { idBudget } = useParams();

  const getBudgetToSet = () => {
    getBudgetById(idBudget)
      .then((budgetData) => {
        setBudget(budgetData.data);
        console.log("budgetData: ", budgetData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getBudgetToSet();
  }, [idBudget]);

  // Divide total_price by 100 to get the correct monetary value
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
      <div className="m-4">
        <div className="flex justify-start items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Detalle del presupuesto
          </h1>
          <Link
            to="/ver-presupuestos"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver a presupuestos
          </Link>
        </div>
        <div className="border border-gray-300 p-8 shadow-lg rounded-lg max-w-6xl m-auto">
          <h2 className="font-semibold text-gray-700 text-center text-4xl mb-8">
            Presupuesto {budget.budget_number}
          </h2>

          <div className="flex justify-between mb-4 p-4 bg-gray-200">
            <div className="flex flex-col gap-4">
              <p className="text-gray-600">
                <span className="font-bold">CLIENTE:</span>{" "}
                {budget.client?.[0]?.name} {budget.client?.[0]?.lastname}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">OBRA:</span> {budget.furniture_name}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-gray-600">
                <span className="font-bold">FECHA:</span>{" "}
                {new Date(budget.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">PRESUPUESTO:</span>{" "}
                {budget.budget_number}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-gray-600">
                <span className="font-bold">FECHA ESTIMADA DE ENTREGA:</span>{" "}
                {budget.deliver_date}
              </p>
            </div>
          </div>

          <table className="min-w-full mb-4 border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  ITEM
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  DESCRIPCIÓN
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 border border-gray-700">
              {budget.furniture?.map((furn, idx) => (
                <tr key={idx} className=" text-center border-b border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {furn.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <p className="mb-6">
                      <span className="font-bold">
                        {furn.category.toUpperCase()}
                      </span>{" "}
                      de {furn.width} (ancho) x {furn.height} (alto) x{" "}
                      {furn.length} (profundidad).
                    </p>
                    {budget?.show_modules ? (
                      <>
                        <p className="mb-2">
                          Incluye los siguientes{" "}
                          <span className="font-bold">MÓDULOS:</span>
                        </p>

                        <ul className="mb-6">
                          {furn.modules_furniture.map((module, idx) => (
                            <li key={idx}>
                              {module.name} - {module.height} (alto) x{" "}
                              {module.length} (largo) x {module.width}{" "}
                              (profundidad)
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      ""
                    )}
                    <p className="mb-2">
                      <span className="font-bold">Comentarios:</span>
                    </p>
                    <p className="mb-2">
                      {budget.comments
                        ? budget.comments
                        : "- No hay comentarios -"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 ">
                    {formatCurrency(totalPriceInUnits)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white flex flex-col border border-gray-700">
            <div className="flex flex-row border-t border-x border-gray-200">
              <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">ENVÍO</p>
              <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                {budget.shipment == true ? "Incluido" : "No Incluido"}
              </p>
            </div>
            <div className="flex flex-row border-t border-x border-gray-200">
              <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2">
                COLOCACIÓN
              </p>
              <p className="px-4 py-2 whitespace-nowrap text-sm w-1/2 border-l border-gray-200">
                {budget.placement == true ? "Incluido" : "No Incluido"}
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
              <p className="px-4 py-2 whitespace-nowrap text-xs text-center">
                *EL SALDO DEL SIGUIENTE PRESUPUESTO ESTARÁ DOLARIZADO SEGÚN
                COTIZACIÓN AL DÍA DE LA SEÑA
              </p>
            </div>
          </div>
          <div className="mt-6 w-full flex flex-col justify-end items-end">
            <table className="text-right">
              <tbody>
                <tr className="bg-gray-700 text-white border border-gray-700">
                  <td className="px-6 text-sm py-2 border-r border-gray-600 w-[200px]">
                    SUBTOTAL:
                  </td>
                  <td className="px-6 text-sm py-2 w-[200px]">
                    {formatCurrency(totalPriceInUnits)}
                  </td>
                </tr>
                <tr className="bg-white border border-gray-700">
                  <td className="px-6 text-sm py-2 border-r border-gray-600 w-[200px]">
                    IVA 21%:
                  </td>
                  <td className="px-6 text-sm py-2 text-black w-[200px]">
                    {formatCurrency(iva)}
                  </td>
                </tr>
                <tr className="bg-gray-700 text-white font-bold border border-gray-700 w-[200px]">
                  <td className="px-6 text-lg py-2 border-r border-gray-600">
                    TOTAL:
                  </td>
                  <td className="px-6 text-lg py-2 w-[200px]">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-16 text-center text-sm text-gray-500">
            DOCUMENTO NO VALIDO COMO FACTURA. PRESUPUESTO VALIDO POR 7 DÍAS
          </p>
        </div>
      </div>
    </>
  );
}

export { BudgetDetails };
