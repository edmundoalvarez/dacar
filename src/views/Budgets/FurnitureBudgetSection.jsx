import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import Select from "react-select";
import QuillEditor from "../../components/QuillEditor.jsx";
import { Oval } from "react-loader-spinner";
import { getFurnitureWithBudgetCalcs } from "../../index.js";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

// ─── component ────────────────────────────────────────────────────────────────
const FurnitureBudgetSection = forwardRef(function FurnitureBudgetSection(
  {
    furnitureId,
    index,
    services,
    edges,
    tables,
    veneer,
    calculationCoefficient,
    onSubtotalChange,
    selectStyles,
    quillModules,
    quillFormats,
  },
  ref
) {
  // ── furniture data ──────────────────────────────────────────────────────────
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── backend calculations ────────────────────────────────────────────────────
  const [totalVeneer, setTotalVeneer] = useState(0);
  const [totalVeneerPolished, setTotalVeneerPolished] = useState(0);
  const [totalVeneerLacqueredOpen, setTotalVeneerLacqueredOpen] = useState(0);
  const [totalLacqueredAll, setTotalLacqueredAll] = useState(0);
  const [totalPantographed, setTotalPantographed] = useState(0);
  const [totalEdgeLength, setTotalEdgeLength] = useState(0);
  const [totalLacqueredEdgeLength, setTotalLacqueredEdgeLength] = useState(0);
  const [totalPolishedEdgeLength, setTotalPolishedEdgeLength] = useState(0);
  const [consolidatedSupplies, setConsolidatedSupplies] = useState([]);
  const [totalSuppliePrice, setTotalSuppliePrice] = useState(0);
  const [showSupplies, setShowSupplies] = useState(true);

  // ── edge state ──────────────────────────────────────────────────────────────
  const [materialEdge, setMaterialEdge] = useState(1);
  const [materialEdgeLaquered, setMaterialEdgeLaquered] = useState(0);
  const [materialEdgePolished, setMaterialEdgePolished] = useState(0);
  const [edgeThickness, setEdgeThickness] = useState("");
  const [edgePolishedThickness, setEdgePolishedThickness] = useState("");
  const [edgeSelectValue, setEdgeSelectValue] = useState("");
  const [edgeLaqueredPrice, setEdgeLaqueredPrice] = useState(0);
  const [edgeLaqueredM2, setEdgeLaqueredM2] = useState(0);
  const [edgePolishedPrice, setEdgePolishedPrice] = useState(0);
  const [edgePolishedM2, setEdgePolishedM2] = useState(0);
  const [edgePrice, setEdgePrice] = useState(0);
  const [edgeM2, setEdgeM2] = useState(0);

  // ── veneer / chapa ──────────────────────────────────────────────────────────
  const [veneerSelectValue, setVeneerSelectValue] = useState("");
  const [chapaPrice, setChapaPrice] = useState("");
  const [chapa, setChapa] = useState(0);

  // ── materials (plates) ──────────────────────────────────────────────────────
  const [countMaterial, setCountMaterial] = useState(0);
  // materialRows[i] = {table: string, qty: number, price: number}
  const [materialRows, setMaterialRows] = useState({});
  const [subtotalMaterialPrice, setSubtotalMaterialPrice] = useState(0);
  const [totalMaterialPrice, setTotalMaterialPrice] = useState(0);

  // ── extra items ─────────────────────────────────────────────────────────────
  const [countItemExtra, setCountItemExtra] = useState(0);
  // extraRows[i] = {name: string, price: number}
  const [extraRows, setExtraRows] = useState({});
  const [subTotalItemExtraPrice, setSubTotalItemExtraPrice] = useState(0);

  // ── adjustment ──────────────────────────────────────────────────────────────
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentPrice, setAdjustmentPrice] = useState("");

  // ── comments ────────────────────────────────────────────────────────────────
  const [comments, setComments] = useState("");

  // ── show modules ────────────────────────────────────────────────────────────
  const [showModules, setShowModules] = useState(false);

  // ── accordion ───────────────────────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState(true);

  // ── subtotal ────────────────────────────────────────────────────────────────
  const [subtotalPrice, setSubtotalPrice] = useState(0);

  // ── services from props ─────────────────────────────────────────────────────
  const {
    enchapadoArtesanalService,
    laqueadoService,
    laqueadoOpenService,
    lustreService,
    pantografiadoService,
    filoService,
    cortePlacaService,
  } = useMemo(
    () => ({
      enchapadoArtesanalService: services.find(
        (s) => s._id === "66a5bbab218ee6221506c133"
      ),
      laqueadoService: services.find(
        (s) => s._id === "66a5bb29218ee6221506c125"
      ),
      laqueadoOpenService: services.find(
        (s) => s._id === "66eb0ec94bc129b0fcfb3dea"
      ),
      lustreService: services.find((s) => s._id === "66a5bb50218ee6221506c12b"),
      pantografiadoService: services.find(
        (s) => s._id === "66a5bb88218ee6221506c130"
      ),
      filoService: services.find((s) => s._id === "66a5baea218ee6221506c119"),
      cortePlacaService: services.find(
        (s) => s._id === "66a5baf9218ee6221506c11c"
      ),
    }),
    [services]
  );

  const tableOptions = useMemo(
    () => tables.map((t) => ({ value: t.name, label: t.name })),
    [tables]
  );
  const edgeOptions = useMemo(
    () => edges.map((e) => ({ value: e._id, label: e.name })),
    [edges]
  );
  const veneerOptions = useMemo(
    () => veneer.map((v) => ({ value: v._id, label: v.name })),
    [veneer]
  );

  // ── load furniture data ─────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    getFurnitureWithBudgetCalcs(furnitureId)
      .then((res) => {
        const furn = res?.data?.furniture;
        const calcs = res?.data?.calculations;
        setFurnitureData(furn);
        setShowSupplies(calcs?.showSupplies ?? true);
        setTotalVeneer(calcs?.totalVeneer ?? 0);
        setTotalVeneerPolished(calcs?.totalVeneerPolished ?? 0);
        setTotalVeneerLacqueredOpen(calcs?.totalVeneerLacqueredOpen ?? 0);
        setTotalLacqueredAll(calcs?.totalLacqueredAll ?? 0);
        setTotalPantographed(calcs?.totalPantographed ?? 0);
        setTotalEdgeLength(calcs?.totalEdgeLength ?? 0);
        setTotalLacqueredEdgeLength(calcs?.totalLacqueredEdgeLength ?? 0);
        setTotalPolishedEdgeLength(calcs?.totalPolishedEdgeLength ?? 0);
        setTotalSuppliePrice(calcs?.totalSuppliePrice ?? 0);
        setConsolidatedSupplies(calcs?.consolidatedSupplies ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [furnitureId]);

  // ── edge handlers ───────────────────────────────────────────────────────────
  const handleEdgeLaqueredBlur = useCallback(
    (value) => {
      const t = Number(value);
      if (t > 0) {
        setMaterialEdgeLaquered(t);
        const m2 = Number(
          ((totalLacqueredEdgeLength * t) / 1000).toFixed(2)
        );
        setEdgeLaqueredM2(m2);
        setEdgeLaqueredPrice(laqueadoService?.price * m2);
      } else {
        setMaterialEdgeLaquered(0);
        setEdgeLaqueredM2(0);
        setEdgeLaqueredPrice(0);
      }
    },
    [totalLacqueredEdgeLength, laqueadoService]
  );

  const handleEdgePolishedBlur = useCallback(
    (value) => {
      const t = Number(value);
      if (t > 0) {
        setMaterialEdgePolished(t);
        const m2 = Number(
          ((totalPolishedEdgeLength * t) / 1000).toFixed(2)
        );
        setEdgePolishedM2(m2);
        setEdgePolishedPrice(lustreService?.price * m2);
      } else {
        setMaterialEdgePolished(0);
        setEdgePolishedM2(0);
        setEdgePolishedPrice(0);
      }
    },
    [totalPolishedEdgeLength, lustreService]
  );

  const handleEdgeSelectChange = useCallback(
    (value) => {
      setEdgeSelectValue(value);
      const selected = edges.find((e) => e._id === value);
      const edgeP = selected ? selected.price : 1;
      setMaterialEdge(edgeP);
      const m2 = Number((totalEdgeLength / 100).toFixed(2));
      setEdgeM2(m2);
      setEdgePrice(
        Math.round(
          m2 * edgeP * calculationCoefficient +
            (filoService?.price ?? 0) * m2
        )
      );
    },
    [edges, totalEdgeLength, calculationCoefficient, filoService]
  );

  // Recalculate edge-no-lacquered price when coefficient or service changes
  useEffect(() => {
    const m2 = Number((totalEdgeLength / 100).toFixed(2));
    setEdgeM2(m2);
    setEdgePrice(
      Math.round(
        m2 * materialEdge * calculationCoefficient +
          (filoService?.price ?? 0) * m2
      )
    );
  }, [totalEdgeLength, materialEdge, calculationCoefficient, filoService]);

  // ── material handlers ───────────────────────────────────────────────────────
  const handleMaterialTableChange = useCallback(
    (idx, value) => {
      const tbl = tables.find((t) => t.name === value);
      setMaterialRows((prev) => ({
        ...prev,
        [idx]: { ...(prev[idx] || {}), table: value, price: tbl?.price ?? 0 },
      }));
    },
    [tables]
  );

  const handleMaterialQtyChange = useCallback((idx, value) => {
    setMaterialRows((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), qty: Number(value) },
    }));
  }, []);

  // Recalculate material totals
  useEffect(() => {
    let sub = 0;
    let tot = 0;
    let totalQty = 0;
    Object.values(materialRows).forEach((m) => {
      const price = m.price ?? 0;
      const qty = m.qty ?? 0;
      sub += price * qty;
      tot += price * qty;
      totalQty += qty;
    });
    sub =
      sub * calculationCoefficient +
      totalQty * (cortePlacaService?.price ?? 0);
    setSubtotalMaterialPrice(sub);
    setTotalMaterialPrice(tot);
  }, [materialRows, calculationCoefficient, cortePlacaService]);

  // ── extra items handlers ────────────────────────────────────────────────────
  const handleExtraNameChange = useCallback((idx, value) => {
    setExtraRows((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), name: value },
    }));
  }, []);

  const handleExtraPriceChange = useCallback((idx, value) => {
    setExtraRows((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), price: Number(value) },
    }));
  }, []);

  useEffect(() => {
    const tot = Object.values(extraRows).reduce(
      (acc, e) => acc + (e.price ?? 0),
      0
    );
    setSubTotalItemExtraPrice(tot);
  }, [extraRows]);

  // ── subtotal computation ────────────────────────────────────────────────────
  useEffect(() => {
    const coef = calculationCoefficient;
    const enchapado = enchapadoArtesanalService?.price ?? 0;
    const veneerPriceTotal = (totalVeneer / 10000) * enchapado * coef;
    const veneerPolishedPriceTotal =
      (totalVeneerPolished / 10000) *
      (laqueadoOpenService?.price ?? 0); // lustrado no-artesanal = laqueadoOpen aprox.
    const lacqueredPrice =
      totalLacqueredAll > 0
        ? (laqueadoService?.price ?? 0) * (totalLacqueredAll / 10000)
        : 0;
    const lacqueredOpenPrice =
      totalVeneerLacqueredOpen > 0
        ? (laqueadoOpenService?.price ?? 0) * (totalVeneerLacqueredOpen / 10000)
        : 0;
    const pantographedPrice =
      totalPantographed > 0
        ? (pantografiadoService?.price ?? 0) * (totalPantographed / 10000)
        : 0;
    const chapaNum = Number(chapaPrice) || 0;
    const sub =
      chapaNum * coef +
      (totalVeneer / 10000) * enchapado * coef +
      veneerPolishedPriceTotal +
      lacqueredPrice +
      lacqueredOpenPrice +
      pantographedPrice +
      (edgeLaqueredPrice || 0) +
      (edgePolishedPrice || 0) +
      (edgePrice || 0) +
      totalSuppliePrice * coef +
      (subtotalMaterialPrice || 0) +
      (subTotalItemExtraPrice || 0) +
      (Number(adjustmentPrice) || 0);

    setSubtotalPrice(sub);
  }, [
    calculationCoefficient,
    totalVeneer,
    totalVeneerPolished,
    totalVeneerLacqueredOpen,
    totalLacqueredAll,
    totalPantographed,
    chapaPrice,
    edgeLaqueredPrice,
    edgePolishedPrice,
    edgePrice,
    totalSuppliePrice,
    subtotalMaterialPrice,
    subTotalItemExtraPrice,
    adjustmentPrice,
    enchapadoArtesanalService,
    laqueadoService,
    laqueadoOpenService,
    pantografiadoService,
  ]);

  // Notify parent of subtotal change
  useEffect(() => {
    onSubtotalChange?.(index, subtotalPrice);
  }, [subtotalPrice, index, onSubtotalChange]);

  // ── expose data via ref ─────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    collectData() {
      const materialsList = Object.values(materialRows).filter((m) => m.table);
      const extraItemsList = Object.values(extraRows).filter((e) => e.name);
      return {
        furniture_name: furnitureData?.name ?? "",
        furniture: furnitureData,
        height: furnitureData?.height ?? "",
        width: furnitureData?.width ?? "",
        length: furnitureData?.length ?? "",
        category: furnitureData?.category?.name ?? "",
        veneer: {
          veneerM2: totalVeneer / 10000,
          veneerPrice:
            (enchapadoArtesanalService?.price ?? 0) * (totalVeneer / 10000),
        },
        veneerPolished: {
          veneerPolishedM2: totalVeneerPolished / 10000,
          veneerPolishedPrice:
            (laqueadoOpenService?.price ?? 0) *
            (totalVeneerPolished / 10000),
        },
        chapa: {
          veneerSelect: veneerSelectValue,
          chapa_price: Number(chapaPrice) || 0,
        },
        lacqueredOpen: {
          lacqueredOpenM2: totalVeneerLacqueredOpen / 10000,
          lacqueredOpenPrice:
            (laqueadoOpenService?.price ?? 0) *
            (totalVeneerLacqueredOpen / 10000),
        },
        lacquered: {
          lacqueredM2: totalLacqueredAll / 10000,
          lacqueredPrice:
            (laqueadoService?.price ?? 0) * (totalLacqueredAll / 10000),
        },
        pantographed: {
          pantographedM2: totalPantographed / 10000,
          pantographedPrice:
            (pantografiadoService?.price ?? 0) * (totalPantographed / 10000),
        },
        edge_lacquered: {
          edgeLaqueredThickness: Number(edgeThickness),
          edgeLaqueredM2: edgeLaqueredM2,
          edgeLaqueredPrice: edgeLaqueredPrice,
          totalLacqueredEdgeLength: totalLacqueredEdgeLength,
        },
        edge_polished: {
          edgePolishedThickness: Number(edgePolishedThickness),
          edgePolishedM2: edgePolishedM2,
          edgePolishedPrice: edgePolishedPrice,
          totalPolishedEdgeLength: totalPolishedEdgeLength,
        },
        edge_no_lacquered: {
          edgeSelect: edgeSelectValue,
          edgeM2: edgeM2,
          edgePrice: edgePrice,
        },
        supplies: consolidatedSupplies,
        materials: materialsList,
        extra_items: extraItemsList,
        adjustment_reason: adjustmentReason,
        adjustment_price: Number(adjustmentPrice) || 0,
        comments: comments,
        subtotal_price: subtotalPrice,
        show_modules: showModules,
      };
    },
    getSubtotal() {
      return subtotalPrice;
    },
    isLoading() {
      return loading;
    },
  }));

  // ── counter helpers ─────────────────────────────────────────────────────────
  const counterMaterial = (e) => {
    const action = e.target.innerText;
    if (action === "+") setCountMaterial((c) => c + 1);
    else if (action === "-")
      setCountMaterial((c) => {
        const next = Math.max(0, c - 1);
        setMaterialRows((prev) => {
          const updated = { ...prev };
          delete updated[c - 1];
          return updated;
        });
        return next;
      });
  };

  const counterItemExtra = (e) => {
    const action = e.target.innerText;
    if (action === "+") setCountItemExtra((c) => c + 1);
    else if (action === "-")
      setCountItemExtra((c) => {
        const next = Math.max(0, c - 1);
        setExtraRows((prev) => {
          const updated = { ...prev };
          delete updated[c - 1];
          return updated;
        });
        return next;
      });
  };

  // ── render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Oval
          visible
          height="40"
          width="40"
          color="rgb(16, 185, 129)"
          secondaryColor="rgb(16, 185, 129)"
          strokeWidth="6"
          ariaLabel="oval-loading"
        />
      </div>
    );
  }

  const sortedModules = furnitureData?.modules_furniture ?? [];

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden text-gray-700">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-800">
            {index + 1}. {furnitureData?.name}
          </span>
          <span className="text-sm text-gray-500">
            {[furnitureData?.height, furnitureData?.length, furnitureData?.width]
              .filter(Boolean)
              .join(" × ")}
          </span>
          {furnitureData?.category?.name && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded">
              {furnitureData.category.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-emerald-700">
            Subtotal: {fmt(subtotalPrice)}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${collapsed ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Accordion body */}
      {!collapsed && (
        <div className="p-6 flex flex-col gap-6 text-gray-700">
          {/* ── Datos del mueble ── */}
          <div className="border-b border-b-emerald-600 pb-6">
            <h3 className="text-xl font-semibold mb-3">Datos del Mueble</h3>
            <div className="flex gap-8 bg-emerald-600 text-white w-fit py-1 px-4 rounded">
              <p>
                <span className="font-bold">Alto:</span> {furnitureData?.height}
              </p>
              <p>
                <span className="font-bold">Largo:</span>{" "}
                {furnitureData?.length}
              </p>
              <p>
                <span className="font-bold">Profundidad:</span>{" "}
                {furnitureData?.width}
              </p>
              <p>
                <span className="font-bold">Categoría:</span>{" "}
                {furnitureData?.category?.name}
              </p>
            </div>
          </div>

          {/* ── Acabados del Mueble ── */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex gap-16 w-full">
              <div className="w-1/2">
                <h3 className="text-xl font-semibold mb-2">
                  Acabados del Mueble
                </h3>

                {totalVeneer > 0 && (
                  <p className="mb-1">
                    <span className="font-bold">Enchapado Artesanal en m2:</span>{" "}
                    {totalVeneer / 10000} m<sup>2</sup> Precio:{" "}
                    {fmt(
                      enchapadoArtesanalService?.price * (totalVeneer / 10000)
                    )}
                  </p>
                )}

                {totalLacqueredAll > 0 && (
                  <p className="mb-1">
                    <span className="font-bold">Laqueado en m2:</span>{" "}
                    {(totalLacqueredAll / 10000).toFixed(2)} m<sup>2</sup>{" "}
                    Precio:{" "}
                    {fmt(
                      laqueadoService?.price * (totalLacqueredAll / 10000)
                    )}
                  </p>
                )}

                {totalVeneerLacqueredOpen > 0 && (
                  <p className="mb-1">
                    <span className="font-bold">Laqueado poro abierto en m2:</span>{" "}
                    {(totalVeneerLacqueredOpen / 10000).toFixed(2)} m<sup>2</sup>{" "}
                    Precio:{" "}
                    {fmt(
                      laqueadoOpenService?.price *
                        (totalVeneerLacqueredOpen / 10000)
                    )}
                  </p>
                )}

                {totalVeneerPolished > 0 && (
                  <p className="mb-1">
                    <span className="font-bold">Lustrado en m2:</span>{" "}
                    {(totalVeneerPolished / 10000).toFixed(2)} m<sup>2</sup>{" "}
                    Precio:{" "}
                    {fmt(
                      lustreService?.price * (totalVeneerPolished / 10000)
                    )}
                  </p>
                )}

                {totalPantographed > 0 && (
                  <p className="mb-1">
                    <span className="font-bold">Pantografiado en m2:</span>{" "}
                    {(totalPantographed / 10000).toFixed(2)} m<sup>2</sup>{" "}
                    Precio:{" "}
                    {fmt(
                      pantografiadoService?.price * (totalPantographed / 10000)
                    )}
                  </p>
                )}

                {/* Filos */}
                <div className="flex flex-col gap-4 mt-2">
                  {totalLacqueredEdgeLength > 0 && (
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <p className="font-bold">Filo Laqueado:</p>
                        {materialEdgeLaquered > 0 ? (
                          <p className="mb-1">
                            {(
                              (totalLacqueredEdgeLength * materialEdgeLaquered) /
                              1000
                            ).toFixed(2)}{" "}
                            m<sup>2</sup> Precio: {fmt(edgeLaqueredPrice)}
                          </p>
                        ) : (
                          <p className="text-red-500 text-sm">
                            Indicar grosor
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-72">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Grosor de la placa (cm)
                        </label>
                        <input
                          type="text"
                          value={edgeThickness}
                          onChange={(e) => setEdgeThickness(e.target.value)}
                          onBlur={(e) =>
                            handleEdgeLaqueredBlur(e.target.value)
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>
                  )}

                  {totalPolishedEdgeLength > 0 && (
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <p className="font-bold">Filo Lustrado:</p>
                        {materialEdgePolished > 0 ? (
                          <p className="mb-1">
                            {(
                              (totalPolishedEdgeLength * materialEdgePolished) /
                              1000
                            ).toFixed(2)}{" "}
                            m<sup>2</sup> Precio: {fmt(edgePolishedPrice)}
                          </p>
                        ) : (
                          <p className="text-red-500 text-sm">
                            Indicar grosor
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col w-72">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Grosor de la placa (cm)
                        </label>
                        <input
                          type="text"
                          value={edgePolishedThickness}
                          onChange={(e) =>
                            setEdgePolishedThickness(e.target.value)
                          }
                          onBlur={(e) =>
                            handleEdgePolishedBlur(e.target.value)
                          }
                          className="border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>
                  )}

                  {totalEdgeLength > 0 && (
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <p className="font-bold">Filo total (sin laquear):</p>
                        <p>
                          {(totalEdgeLength / 100).toFixed(2)} m Precio:{" "}
                          {fmt(
                            (totalEdgeLength / 100) * materialEdge +
                              (filoService?.price ?? 0) *
                                (totalEdgeLength / 100)
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col w-72">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Tipo de filo
                        </label>
                        <Select
                          inputId={`edgeSelect-${index}`}
                          instanceId={`edgeSelect-${index}`}
                          placeholder="Elegir una opción"
                          isClearable
                          options={edgeOptions}
                          value={
                            edgeOptions.find(
                              (o) => o.value === edgeSelectValue
                            ) || null
                          }
                          onChange={(option) => {
                            handleEdgeSelectChange(option?.value || "");
                          }}
                          styles={selectStyles}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapa */}
                {totalVeneerPolished > 0 && (
                  <div className="flex items-start gap-6 mt-4">
                    <div className="flex-1">
                      <p className="font-bold">
                        Lustrado en m2 (Chapa):{" "}
                        {(totalVeneerPolished / 10000).toFixed(2)} m
                        <sup>2</sup>
                      </p>
                    </div>
                    <div className="flex flex-col w-72 gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tipo de chapa
                      </label>
                      <Select
                        inputId={`veneerSelect-${index}`}
                        instanceId={`veneerSelect-${index}`}
                        placeholder="Elegir chapa"
                        isClearable
                        options={veneerOptions}
                        value={
                          veneerOptions.find(
                            (o) => o.value === veneerSelectValue
                          ) || null
                        }
                        onChange={(option) => {
                          setVeneerSelectValue(option?.value || "");
                        }}
                        styles={selectStyles}
                      />
                      <label className="text-sm font-medium text-gray-700 mt-1">
                        Precio chapa
                      </label>
                      <input
                        type="number"
                        value={chapaPrice}
                        onChange={(e) => setChapaPrice(e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Insumos */}
              {showSupplies && (
                <div className="w-1/2">
                  <h3 className="text-xl font-semibold mb-2">
                    Insumos totales del mueble {fmt(totalSuppliePrice)}
                  </h3>
                  {consolidatedSupplies.length > 0 && (
                    <div className="rounded-lg overflow-hidden border-2 border-emerald-600">
                      {consolidatedSupplies.map((supply, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-4 ${sIdx % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                        >
                          <p className="text-gray-800">
                            <span className="font-bold">Nombre:</span>{" "}
                            {supply.name}
                          </p>
                          <p className="text-gray-800">
                            <span className="font-bold">Cantidad:</span>{" "}
                            {supply.qty}
                          </p>
                          <p className="text-gray-800">
                            <span className="font-bold">Precio total:</span>{" "}
                            {fmt(supply.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Cantidad de placas ── */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xl font-semibold uppercase w-1/4">
                Cantidad de placas
              </p>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  -
                </button>
                <p>Count: {countMaterial}</p>
                <p>{fmt(totalMaterialPrice)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[...Array(countMaterial)].map((_, mIdx) => (
                <div key={`mat-${index}-${mIdx}`} className="flex gap-4 w-full">
                  <div className="flex flex-row gap-4 w-1/2">
                    <div className="flex flex-col gap-2 w-1/2">
                      <label>Seleccionar placa</label>
                      <Select
                        inputId={`matTable-${index}-${mIdx}`}
                        instanceId={`matTable-${index}-${mIdx}`}
                        placeholder="Elegir placa"
                        isClearable
                        options={tableOptions}
                        value={
                          tableOptions.find(
                            (o) => o.value === materialRows[mIdx]?.table
                          ) || null
                        }
                        onChange={(option) =>
                          handleMaterialTableChange(mIdx, option?.value || "")
                        }
                        styles={selectStyles}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-1/2">
                      <label>Cantidad de placas</label>
                      <input
                        type="number"
                        min="0"
                        value={materialRows[mIdx]?.qty ?? ""}
                        onChange={(e) =>
                          handleMaterialQtyChange(mIdx, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Items extra */}
            <div className="flex items-center gap-2 mt-6 mb-4">
              <p className="text-xl font-semibold uppercase w-1/4">
                Items extra
              </p>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterItemExtra}
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterItemExtra}
                >
                  -
                </button>
                <p>Count: {countItemExtra}</p>
                <p>{fmt(subTotalItemExtraPrice)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[...Array(countItemExtra)].map((_, eIdx) => (
                <div
                  key={`extra-${index}-${eIdx}`}
                  className="flex w-1/2 gap-4"
                >
                  <div className="flex flex-col w-1/2 gap-2">
                    <label>Nombre del ítem</label>
                    <input
                      type="text"
                      value={extraRows[eIdx]?.name ?? ""}
                      onChange={(e) =>
                        handleExtraNameChange(eIdx, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="flex flex-col w-1/2 gap-2">
                    <label>Valor del ítem</label>
                    <input
                      type="number"
                      min="0"
                      value={extraRows[eIdx]?.price ?? ""}
                      onChange={(e) =>
                        handleExtraPriceChange(eIdx, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Item de ajuste ── */}
          <div className="border-b border-gray-200 pb-6">
            <p className="text-xl font-semibold uppercase mb-3">
              Ítem de ajuste
            </p>
            <div className="flex gap-4 w-3/4">
              <div className="flex flex-col w-2/3 gap-2">
                <label>Razón del ajuste</label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                  placeholder="Descripción del ajuste"
                />
              </div>
              <div className="flex flex-col w-1/3 gap-2">
                <label>Valor del ajuste</label>
                <input
                  type="number"
                  value={adjustmentPrice}
                  onChange={(e) => setAdjustmentPrice(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* ── Descripción del mueble ── */}
          <div className="border-b border-gray-200 pb-6">
            <label className="block text-xl font-semibold mb-2">
              Descripción del mueble
            </label>
            <QuillEditor
              value={comments}
              onChange={setComments}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Descripción técnica del mueble..."
            />
          </div>

          {/* ── Subtotal del mueble ── */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-emerald-800">
              Subtotal {furnitureData?.name}: {fmt(subtotalPrice)}
            </p>
          </div>

          {/* ── Despiece por módulo ── */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header con checkbox */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-700">
              <p className="font-semibold text-white">
                Despiece por módulo{" "}
                {sortedModules.length > 0 && (
                  <span className="text-gray-300 text-sm font-normal">
                    ({sortedModules.length} módulos)
                  </span>
                )}
              </p>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id={`showModules-${index}`}
                  checked={showModules}
                  onChange={(e) => setShowModules(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400"
                />
                <span className="text-sm text-gray-200">
                  Incluir en el presupuesto
                </span>
              </label>
            </div>

            {sortedModules.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500 italic bg-white">
                Este mueble no tiene módulos cargados.
              </p>
            ) : (
              <div className="p-4 bg-white text-black">
                {sortedModules.map((module) => (
                  <div
                    key={module._id}
                    className="mb-8 p-4 bg-white rounded-md shadow-md border-2 border-emerald-600"
                  >
                    <h3 className="text-xl font-bold mb-2 bg-emerald-600 text-white px-3 py-2 rounded">
                      {module.name}
                    </h3>

                    {/* Descripción e Insumos del módulo */}
                    <div className="flex gap-10">
                      <div className="w-2/4">
                        <h4 className="text-base font-semibold border-2 border-emerald-600 px-3 py-1 text-emerald-600 rounded">
                          Descripción módulo
                        </h4>
                        <div className="p-3 text-gray-800">
                          <p className="mb-1">
                            <span className="font-bold">Material:</span>{" "}
                            {module.material}
                          </p>
                          <p className="mb-1">
                            <span className="font-bold">Alto:</span>{" "}
                            {module.height}
                          </p>
                          <p className="mb-1">
                            <span className="font-bold">Largo:</span>{" "}
                            {module.length}
                          </p>
                          <p className="mb-1">
                            <span className="font-bold">Profundidad:</span>{" "}
                            {module.width}
                          </p>
                          <p className="mb-1">
                            <span className="font-bold">Descripción:</span>{" "}
                            {module.description}
                          </p>
                          <p className="mb-1">
                            <span className="font-bold">Cantidad de piezas:</span>{" "}
                            {module.pieces_number}
                          </p>
                        </div>
                      </div>

                      <div className="w-2/4">
                        <h4 className="text-base font-semibold border-2 border-emerald-600 px-3 py-1 text-emerald-600 rounded">
                          Insumos módulo
                        </h4>
                        <div className="p-3 text-gray-800">
                          {(module.supplies_module || []).map((supply, sIdx) => (
                            <div key={sIdx} className="mb-2">
                              <p>
                                <span className="font-bold">Nombre:</span>{" "}
                                {supply.supplie_name}
                              </p>
                              <p>
                                <span className="font-bold">Cantidad:</span>{" "}
                                {supply.supplie_qty}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Piezas */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold bg-emerald-600 rounded-tl rounded-tr m-0 px-3 py-1 text-white">
                        Piezas
                      </h4>
                      <div className="overflow-x-auto rounded-bl rounded-br shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-700">
                            <tr>
                              {[
                                "Nombre",
                                "Cant.",
                                "Material",
                                "Comentario",
                                "Largo",
                                "Alto",
                                "Orientación",
                                "Acabado",
                                "Filo Largo",
                                "Filo Alto",
                                "Tipo de Filo",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(module.pieces || [])
                              .slice()
                              .sort((a, b) =>
                                (a.material || "").localeCompare(b.material || "")
                              )
                              .map((piece, pIdx) => (
                                <tr
                                  key={piece._id || pIdx}
                                  className="border-t border-r border-l text-gray-800"
                                >
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.name}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.qty}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.material}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.comment}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.orientation === "cross-horizontal"
                                      ? piece.length
                                      : piece.width}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.orientation === "cross-horizontal"
                                      ? piece.width
                                      : piece.length}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.orientation === "cross-vertical"
                                      ? "Transversal Vertical"
                                      : piece.orientation === "cross-horizontal"
                                      ? "Transversal Horizontal"
                                      : piece.orientation === "side"
                                      ? "Lateral"
                                      : ""}
                                  </td>
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.lacqueredPiece ? (
                                      <>
                                        Laqueado
                                        <br />
                                        {piece.lacqueredPieceSides === 1 && (
                                          <strong>1 lado</strong>
                                        )}
                                        {piece.lacqueredPieceSides === 2 && (
                                          <strong>2 lados</strong>
                                        )}
                                        {piece.pantographed && (
                                          <>
                                            <br />
                                            <strong>Pantografiado</strong>
                                          </>
                                        )}
                                      </>
                                    ) : piece.veneer ? (
                                      <>
                                        Enchapado Artesanal
                                        <br />
                                        {piece.veneerFinishing === "veneerLacquered" &&
                                        piece.veneerLacqueredPieceSides === 1 ? (
                                          <strong>Laqueado Poro abierto <br /> 1 lado</strong>
                                        ) : piece.veneerFinishing === "veneerLacquered" &&
                                          piece.veneerLacqueredPieceSides === 2 ? (
                                          <strong>Laqueado Poro abierto <br /> 2 lados</strong>
                                        ) : piece.veneerFinishing === "veneerPolished" ? (
                                          <strong>Lustrado</strong>
                                        ) : (
                                          ""
                                        )}
                                        {piece.pantographed && (
                                          <>
                                            <br />
                                            <strong>Pantografiado</strong>
                                          </>
                                        )}
                                      </>
                                    ) : piece.veneer2 ? (
                                      <>
                                        Enchapado No Artesanal
                                        <br />
                                        {piece.veneer2Finishing === "veneer2Lacquered" &&
                                        piece.veneer2LacqueredPieceSides === 1 ? (
                                          <strong>Laqueado Poro abierto <br />1 lado</strong>
                                        ) : piece.veneer2Finishing === "veneer2Lacquered" &&
                                          piece.veneer2LacqueredPieceSides === 2 ? (
                                          <strong>Laqueado Poro abierto <br /> 2 lados</strong>
                                        ) : piece.veneer2Finishing === "veneer2Polished" ? (
                                          <strong>Lustrado</strong>
                                        ) : (
                                          ""
                                        )}
                                        {piece.pantographed && (
                                          <>
                                            <br />
                                            <strong>Pantografiado</strong>
                                          </>
                                        )}
                                      </>
                                    ) : piece.melamine ? (
                                      <>
                                        Melamina
                                        <br />
                                        {piece.melamineLacquered && (
                                          <strong>Laqueada</strong>
                                        )}
                                        <br />
                                        {piece.melamineLacqueredPieceSides === 1 && (
                                          <strong>1 lado</strong>
                                        )}
                                        {piece.melamineLacqueredPieceSides === 2 && (
                                          <strong>2 lados</strong>
                                        )}{" "}
                                        {piece.pantographed && (
                                          <>
                                            <br />
                                            <strong>Pantografiado</strong>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      "No indica"
                                    )}
                                  </td>
                                  {/* Filo Largo */}
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.orientation === "cross-horizontal"
                                      ? piece.edgeLength
                                        ? `Sí, ${
                                            piece.edgeLengthSides === 1
                                              ? "un lado"
                                              : piece.edgeLengthSides === 2
                                              ? "dos lados"
                                              : "falta cantidad lados"
                                          }`
                                        : "No"
                                      : piece.edgeWidth
                                      ? `Sí, ${
                                          piece.edgeWidthSides === 1
                                            ? "un lado"
                                            : piece.edgeWidthSides === 2
                                            ? "dos lados"
                                            : "falta cantidad lados"
                                        }`
                                      : "No"}
                                  </td>
                                  {/* Filo Alto */}
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.orientation === "cross-horizontal"
                                      ? piece.edgeWidth
                                        ? `Sí, ${
                                            piece.edgeWidthSides === 1
                                              ? "un lado"
                                              : piece.edgeWidthSides === 2
                                              ? "dos lados"
                                              : "falta cantidad lados"
                                          }`
                                        : "No"
                                      : piece.edgeLength
                                      ? `Sí, ${
                                          piece.edgeLengthSides === 1
                                            ? "un lado"
                                            : piece.edgeLengthSides === 2
                                            ? "dos lados"
                                            : "falta cantidad lados"
                                        }`
                                      : "No"}
                                  </td>
                                  {/* Tipo de filo */}
                                  <td className="px-4 py-2 text-center border-b">
                                    {piece.lacqueredEdge
                                      ? "Laqueado"
                                      : piece.polishedEdge
                                      ? "Lustrado"
                                      : ""}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export { FurnitureBudgetSection };
