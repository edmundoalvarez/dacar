// helpers/Budgets/getBudgetErrorMessage.js
// Traduce un error de axios al guardar/editar un presupuesto en un mensaje
// específico para el usuario, en vez de un genérico de "conexión" que oculta
// la causa real (payload demasiado grande, validación, etc.).
export function getBudgetErrorMessage(err) {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.error || err?.response?.data?.message;

  if (!err?.response) {
    return "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
  }

  if (status === 413) {
    return (
      serverMessage ||
      "El presupuesto es demasiado grande para enviarse. Probá reducir la cantidad de muebles o adjuntos."
    );
  }

  if (serverMessage) {
    return serverMessage;
  }

  if (status === 401 || status === 403) {
    return "Tu sesión venció o no tenés permisos. Volvé a iniciar sesión e intentá de nuevo.";
  }

  return `Error al guardar el presupuesto (código ${status}). Intentá de nuevo.`;
}
