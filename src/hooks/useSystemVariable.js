import { useEffect, useState } from "react";
import { getSystemVariableByKey } from "../services/SystemVariables/getSystemVariableByKey.js";

/**
 * Lee una variable del sistema (`/system-variables/public/:key`) y expone,
 * además del valor, si lo que se está usando vino realmente del sistema o
 * si se cayó en el `fallback` por error de red, valor vacío o valor no
 * interpretable (`parse` devuelve `null`/`NaN`).
 *
 * Esto evita que un fallo silencioso (variable inexistente, mal cargada,
 * o con `value`/`description` invertidos) sea indistinguible en pantalla
 * de un valor real, ya que antes esos casos no dejaban ningún rastro.
 *
 * @param {string} key clave de la variable del sistema (ej. "budget_iva")
 * @param {object} options
 * @param {*} options.fallback valor a usar si no se puede leer la variable
 * @param {(rawValue: string) => *} [options.parse] transforma el `value` crudo (string). Por defecto lo deja tal cual.
 * @returns {{ value: *, source: "system"|"fallback", loading: boolean, error: string|null, usedFallback: boolean }}
 */
function useSystemVariable(key, { fallback, parse = (raw) => raw } = {}) {
  const [value, setValue] = useState(fallback);
  const [source, setSource] = useState("fallback");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    getSystemVariableByKey(key, controller.signal)
      .then((variable) => {
        if (variable?.value == null || variable.value === "") {
          console.warn(
            `[useSystemVariable] La variable "${key}" no tiene un valor cargado. Se usa el valor por defecto:`,
            fallback
          );
          setSource("fallback");
          setError("empty");
          return;
        }

        const parsed = parse(variable.value);
        const isInvalidNumber = typeof parsed === "number" && Number.isNaN(parsed);
        if (parsed == null || isInvalidNumber) {
          console.warn(
            `[useSystemVariable] La variable "${key}" tiene un valor no interpretable ("${variable.value}"). Se usa el valor por defecto:`,
            fallback
          );
          setSource("fallback");
          setError("invalid");
          return;
        }

        setValue(parsed);
        setSource("system");
        setError(null);
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        console.error(`[useSystemVariable] Error al obtener la variable "${key}":`, err);
        setSource("fallback");
        setError("fetch");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [key]);

  return { value, setValue, source, loading, error, usedFallback: source === "fallback" };
}

export { useSystemVariable };
