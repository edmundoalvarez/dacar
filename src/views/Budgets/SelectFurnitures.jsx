import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllFurnituresList, getFurnitureCategories } from "../../index.js";

function SelectFurnitures() {
  const navigate = useNavigate();

  const [furnitures, setFurnitures] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Multi-select
  const [selectedFurnitures, setSelectedFurnitures] = useState([]); // [{_id, name, height, length, width, category}]

  const controllerRef = useRef(null);
  const reqSeqRef = useRef(0);

  const [rawFurnitures, setRawFurnitures] = useState([]);

  const getFurnituresToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const seq = ++reqSeqRef.current;

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllFurnituresList(term, page, itemsPerPage, controller.signal);
        if (!data || seq !== reqSeqRef.current) return;
        setRawFurnitures(data.furnitures || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
      } catch (_) {
        // cancelación silenciosa
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  // Client-side category filter
  useEffect(() => {
    if (!selectedCategoryId) {
      setFurnitures(rawFurnitures);
    } else {
      setFurnitures(
        rawFurnitures.filter(
          (f) =>
            f?.category?._id === selectedCategoryId ||
            f?.category === selectedCategoryId
        )
      );
    }
  }, [rawFurnitures, selectedCategoryId]);

  useEffect(() => {
    getFurnituresToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, searchTerm, getFurnituresToSet]);

  useEffect(() => {
    getFurnitureCategories()
      .then((res) => setCategories(Array.isArray(res) ? res : res?.data || []))
      .catch(() => {});
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        getFurnituresToSet(term, 1);
        setCurrentPage(1);
      }, 600),
    [getFurnituresToSet]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoader(true);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    // No need to re-fetch; category filter is client-side
  };

  const isSelected = (id) => selectedFurnitures.some((f) => f._id === id);

  const toggleSelect = (furniture) => {
    if (isSelected(furniture._id)) {
      setSelectedFurnitures((prev) => prev.filter((f) => f._id !== furniture._id));
    } else {
      setSelectedFurnitures((prev) => [...prev, furniture]);
    }
  };

  const removeSelected = (id) => {
    setSelectedFurnitures((prev) => prev.filter((f) => f._id !== id));
  };

  const handleContinue = () => {
    if (selectedFurnitures.length === 0) return;
    if (selectedFurnitures.length === 1) {
      navigate(`/presupuestar-mueble/${selectedFurnitures[0]._id}`);
    } else {
      navigate("/presupuestar-mueble/multi", {
        state: { furnitureIds: selectedFurnitures.map((f) => f._id) },
      });
    }
  };

  const categoryName = (furn) =>
    furn?.category?.name || furn?.category || "—";

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">
            Crear Presupuesto
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre"
              className="border border-gray-300 p-2 rounded-lg shadow-md w-[320px]"
            />
            <select
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              className="border border-gray-300 p-2 rounded-lg shadow-md"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Oval
              visible={searchLoader}
              height="30"
              width="30"
              color="rgb(92, 92, 92)"
              secondaryColor="rgb(92, 92, 92)"
              strokeWidth="6"
              ariaLabel="oval-loading"
            />
          </div>
          <div className="flex gap-3">
            <Link
              to="/ver-presupuestos"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2 items-center"
            >
              <img src="./icon_back.svg" alt="Volver" className="w-[18px]" />
              <p className="m-0 leading-loose">Volver</p>
            </Link>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Lista de muebles */}
          <div className="flex-1">
            <div className="rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="w-10 px-4 py-3" />
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Largo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Alto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Prof.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Categoría
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {furnitures.map((furn) => {
                    const selected = isSelected(furn._id);
                    return (
                      <tr
                        key={furn._id}
                        onClick={() => toggleSelect(furn)}
                        className={`cursor-pointer transition-colors duration-100 ${
                          selected
                            ? "bg-emerald-50 hover:bg-emerald-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            readOnly
                            checked={selected}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-800">
                          {furn.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {furn.length || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {furn.height || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {furn.width || "—"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {categoryName(furn)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Spinner / empty state */}
              <div className="flex justify-center items-center h-16">
                {loader && (
                  <Grid
                    visible={loader}
                    height="40"
                    width="40"
                    color="rgb(92, 92, 92)"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperClass="grid-wrapper"
                  />
                )}
                {!loader && furnitures.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No se encontraron muebles.
                  </p>
                )}
              </div>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 py-6 text-black">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-700"
                }`}
              >
                Anterior
              </button>
              <span className="text-lg font-medium">
                Página <span>{currentPage}</span> de <span>{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-700"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Panel de seleccionados */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                Muebles seleccionados{" "}
                <span className="text-emerald-600">
                  ({selectedFurnitures.length})
                </span>
              </h2>

              {selectedFurnitures.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Hacé clic en un mueble para seleccionarlo.
                </p>
              ) : (
                <ul className="flex flex-col gap-2 mb-4 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedFurnitures.map((furn, idx) => (
                    <li
                      key={furn._id}
                      className="flex items-start justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-emerald-800 mr-1">
                          {idx + 1}.
                        </span>
                        <span className="text-gray-800">{furn.name}</span>
                        {(furn.height || furn.length || furn.width) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[furn.height, furn.length, furn.width]
                              .filter(Boolean)
                              .join(" × ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelected(furn._id);
                        }}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5"
                        title="Quitar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={handleContinue}
                disabled={selectedFurnitures.length === 0}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                  selectedFurnitures.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {selectedFurnitures.length <= 1
                  ? "Continuar"
                  : `Presupuestar ${selectedFurnitures.length} muebles`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { SelectFurnitures };
