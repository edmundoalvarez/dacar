import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Grid, Oval } from "react-loader-spinner";
import {
  createSystemVariable,
  deleteSystemVariable,
  getSystemVariables,
  updateSystemVariable,
} from "../../index.js";
import { AuthContext } from "../../context/AuthContext.jsx";

function SystemVariables() {
  const ENV = import.meta.env.VITE_ENV;
  const { user } = useContext(AuthContext);

  const [variables, setVariables] = useState([]);
  const [loader, setLoader] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editVariable, setEditVariable] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  const controllerRef = useRef(null);

  const fetchVariables = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoader(true);
    try {
      const data = await getSystemVariables(controller.signal);
      setVariables(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") {
        return;
      }
      console.error("Error al obtener variables del sistema:", err);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchVariables();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchVariables]);

  const openEditModal = (variable) => {
    setEditVariable(variable);
    setEditValue(variable.value || "");
    setEditDescription(variable.description || "");
    setEditStatus(Boolean(variable.status));
  };

  const closeEditModal = () => {
    setEditVariable(null);
    setEditValue("");
    setEditDescription("");
    setEditStatus(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    try {
      setActionLoading(true);
      await createSystemVariable({
        key: newKey.trim(),
        value: newValue,
        description: newDescription,
      });
      setNewKey("");
      setNewValue("");
      setNewDescription("");
      await fetchVariables();
    } catch (err) {
      console.error("Error al crear variable:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editVariable) return;
    try {
      setActionLoading(true);
      await updateSystemVariable(editVariable._id, {
        value: editValue,
        description: editDescription,
        status: editStatus,
      });
      await fetchVariables();
      closeEditModal();
    } catch (err) {
      console.error("Error al actualizar variable:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (variableId) => {
    try {
      setActionLoading(true);
      await deleteSystemVariable(variableId);
      await fetchVariables();
    } catch (err) {
      console.error("Error al inactivar variable:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pb-8 px-4 sm:px-8 lg:px-16 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8 bg-gray-800 p-4 sm:p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-semibold text-white">
          Variables del sistema
        </h1>
      </div>

      {ENV === "TEST" && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
          ⚠️ Estás en entorno de pruebas (TEST)
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Crear variable
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Clave</label>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="budget_payment_terms"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Valor</label>
            <textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              rows={3}
              placeholder="Texto a mostrar..."
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Uso / pantalla"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center gap-2 disabled:opacity-60"
            >
              {actionLoading && (
                <Oval
                  visible={actionLoading}
                  height="18"
                  width="18"
                  color="#ffffff"
                  secondaryColor="#ffffff"
                  strokeWidth="6"
                  ariaLabel="oval-loading"
                />
              )}
              Guardar
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto overflow-y-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200 shadow-sm">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                Clave
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(Array.isArray(variables) ? variables : []).map((variable) => (
              <tr key={variable._id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {variable.key}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line max-w-[420px]">
                  {variable.value}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {variable.description || "-"}
                </td>
                <td className="px-6 py-4 text-center text-sm">
                  {variable.status ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                      Activa
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-white bg-orange rounded-md px-3 py-0.5 flex items-center gap-2"
                      onClick={() => openEditModal(variable)}
                    >
                      Editar
                    </button>
                    {variable.status && (
                      <button
                        className="text-white bg-red-500 rounded-md px-3 py-0.5 flex items-center gap-2"
                        onClick={() => handleDeactivate(variable._id)}
                        disabled={actionLoading}
                      >
                        Inactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
          <Grid
            visible={loader}
            height="80"
            width="80"
            color="rgb(92, 92, 92)"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperClass="grid-wrapper"
          />
        </div>
      </div>

      {editVariable && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 max-w-2xl w-full text-black">
            <h2 className="text-xl font-semibold text-center">
              Editar variable
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clave
                </label>
                <input
                  type="text"
                  value={editVariable.key}
                  disabled
                  className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={5}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editStatus}
                  onChange={(e) => setEditStatus(e.target.checked)}
                />
                <span>Activa</span>
              </label>
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white py-2 px-4 rounded disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={actionLoading}
                >
                  {actionLoading && (
                    <Oval
                      visible={actionLoading}
                      height="18"
                      width="18"
                      color="#ffffff"
                      secondaryColor="#ffffff"
                      strokeWidth="6"
                      ariaLabel="oval-loading"
                    />
                  )}
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded"
                  onClick={closeEditModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { SystemVariables };
