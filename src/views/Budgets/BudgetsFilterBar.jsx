import { Oval } from "react-loader-spinner";

/**
 * Barra de filtros reutilizable para las vistas de Presupuestos y
 * Presupuestos Confirmados. Se muestra en una tarjeta propia, separada del
 * header, para que los 5 campos entren cómodos en pantallas de notebook
 * (lg, ≥1024px) sin romper el layout.
 */
function BudgetsFilterBar({
  searchTerm,
  furnitureName,
  budgetNumber,
  dateFrom,
  dateTo,
  onSearchTermChange,
  onFurnitureNameChange,
  onBudgetNumberChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  loading = false,
}) {
  const hasActiveFilters = Boolean(
    searchTerm || furnitureName || budgetNumber || dateFrom || dateTo
  );

  const inputClasses =
    "border border-gray-300 p-2 rounded-lg shadow-sm text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelClasses = "text-xs font-medium text-gray-500";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className={labelClasses}>Cliente</label>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchTermChange}
            placeholder="Nombre o apellido"
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses}>Mueble</label>
          <input
            type="text"
            value={furnitureName}
            onChange={onFurnitureNameChange}
            placeholder="Nombre del mueble"
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses}>Nº Presupuesto</label>
          <input
            type="text"
            inputMode="numeric"
            value={budgetNumber}
            onChange={onBudgetNumberChange}
            placeholder="N° presupuesto"
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses}>Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={onDateFromChange}
            max={dateTo || undefined}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses}>Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={onDateToChange}
            min={dateFrom || undefined}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 min-h-[22px]">
        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className={`text-xs font-medium underline transition ${
            hasActiveFilters
              ? "text-gray-500 hover:text-red-600"
              : "text-transparent cursor-default select-none"
          }`}
        >
          Limpiar filtros
        </button>

        <Oval
          visible={loading}
          height="20"
          width="20"
          color="rgb(92, 92, 92)"
          secondaryColor="rgb(92, 92, 92)"
          strokeWidth="6"
          ariaLabel="oval-loading"
        />
      </div>
    </div>
  );
}

export { BudgetsFilterBar };
