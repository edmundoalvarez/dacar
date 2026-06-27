/**
 * Modal de errores de validación para presupuestos.
 *
 * Props:
 *  - errors: { global: string[], byFurniture: { name: string, index: number, errors: string[] }[] }
 *  - onClose: () => void
 *  - onGoToFurniture?: (index: number) => void  — navega al mueble con error al cerrar
 */
export default function ValidationErrorModal({ errors, onClose, onGoToFurniture }) {
  if (!errors) return null;

  const hasGlobal = errors.global?.length > 0;
  const hasFurniture = errors.byFurniture?.some((f) => f.errors.length > 0);
  const firstFurnitureWithError = errors.byFurniture?.find((f) => f.errors.length > 0);

  const handleClose = () => {
    onClose();
    if (firstFurnitureWithError && onGoToFurniture) {
      onGoToFurniture(firstFurnitureWithError.index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 bg-red-600 px-6 py-4">
          <svg
            className="w-6 h-6 text-white flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <h2 className="text-white font-semibold text-lg">
            Hay campos incompletos o incorrectos
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-600 text-sm">
            Por favor corregí los siguientes errores antes de guardar el presupuesto:
          </p>

          {/* Errores globales */}
          {hasGlobal && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                General
              </p>
              <ul className="flex flex-col gap-1">
                {errors.global.map((err, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Errores por mueble */}
          {hasFurniture &&
            errors.byFurniture
              .filter((f) => f.errors.length > 0)
              .map((f) => (
                <div key={f.index} className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-gray-700">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded mr-2">
                      Mueble {f.index + 1}
                    </span>
                    {f.name}
                  </p>
                  <ul className="flex flex-col gap-1 pl-2">
                    {f.errors.map((err, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {firstFurnitureWithError && onGoToFurniture
              ? `Ir a "${firstFurnitureWithError.name}"`
              : "Entendido"}
          </button>
        </div>
      </div>
    </div>
  );
}
