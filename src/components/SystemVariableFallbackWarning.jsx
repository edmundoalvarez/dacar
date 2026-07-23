import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

/**
 * Aviso visible cuando un campo está mostrando un valor por defecto
 * hardcodeado en vez del valor real cargado en "Variables del sistema",
 * porque la variable no existe, vino vacía, o no se pudo interpretar.
 *
 * Sin este aviso, ese fallback es indistinguible en pantalla del valor
 * real, lo que hace muy difícil notar cuándo algo falló.
 */
function SystemVariableFallbackWarning({ variableKey }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium"
      title={`No se pudo cargar la variable del sistema "${variableKey}". Se está mostrando un valor por defecto. Revisá /variables-sistema.`}
    >
      <FontAwesomeIcon icon={faTriangleExclamation} />
      Usando valor por defecto (revisar variable del sistema)
    </span>
  );
}

export { SystemVariableFallbackWarning };
