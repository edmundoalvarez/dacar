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
    isOpen,
    onToggle,
    initialValues,
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

  // ── show despiece ────────────────────────────────────────────────────────────
  const [showDespiece, setShowDespiece] = useState(false);

  // ── subtotal ────────────────────────────────────────────────────────────────
  const [subtotalPrice, setSubtotalPrice] = useState(0);

  // ── per-section coefficient (override del global) ───────────────────────────
  const [sectionCoefficient, setSectionCoefficient] = useState(calculationCoefficient);
  const [sectionCoefficientInput, setSectionCoefficientInput] = useState(
    String(calculationCoefficient)
  );
  const userOverriddenCoef = useRef(false);

  // Sincroniza con el global mientras el usuario no haya tocado el input
  useEffect(() => {
    if (!userOverriddenCoef.current) {
      setSectionCoefficient(calculationCoefficient);
      setSectionCoefficientInput(String(calculationCoefficient));
    }
  }, [calculationCoefficient]);

  // ── envío y colocación por mueble ───────────────────────────────────────────
  const [itemShipmentPrice, setItemShipmentPrice] = useState(0);
  const [itemPlacementDays, setItemPlacementDays] = useState(0);
  const [itemPlacementPricePerDay, setItemPlacementPricePerDay] = useState(0);

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
    if (!furnitureId) {
      // En modo edición sin ID válido, usar datos guardados en initialValues
      if (initialValues?.furniture) {
        setFurnitureData(
          typeof initialValues.furniture === "object"
            ? initialValues.furniture
            : null
        );
      }
      setLoading(false);
      return;
    }
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

        // Pre-poblar descripción desde el parámetro del mueble/categoría cuando
        // no hay valores guardados (modo creación multi-mueble).
        const parameterHtml = furn?.parameter || furn?.category?.parameter || "";
        if (parameterHtml && !initialValues?.comments) {
          setComments(parameterHtml);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [furnitureId]);

  // ── pre-populate from initialValues (edit mode) ─────────────────────────────
  useEffect(() => {
    if (!initialValues || loading) return;

    // Filo laqueado
    const thickness = initialValues.edge_lacquered?.edgeLaqueredThickness;
    if (Number(thickness) > 0) {
      setEdgeThickness(String(thickness));
      const m2 = Number(((totalLacqueredEdgeLength * thickness) / 1000).toFixed(2));
      setMaterialEdgeLaquered(thickness);
      setEdgeLaqueredM2(m2);
      setEdgeLaqueredPrice((laqueadoService?.price ?? 0) * m2);
    }

    // Filo lustrado
    const thicknessP = initialValues.edge_polished?.edgePolishedThickness;
    if (Number(thicknessP) > 0) {
      setEdgePolishedThickness(String(thicknessP));
      const m2p = Number(((totalPolishedEdgeLength * thicknessP) / 1000).toFixed(2));
      setMaterialEdgePolished(thicknessP);
      setEdgePolishedM2(m2p);
      setEdgePolishedPrice((lustreService?.price ?? 0) * m2p);
    }

    // Filo sin laquear
    const edgeSel = initialValues.edge_no_lacquered?.edgeSelect;
    if (edgeSel) {
      const selected = edges.find((e) => e._id === edgeSel);
      const edgeP = selected ? selected.price : 1;
      setEdgeSelectValue(edgeSel);
      setMaterialEdge(edgeP);
      const m2e = Number((totalEdgeLength / 100).toFixed(2));
      setEdgeM2(m2e);
      const coefToUse =
        initialValues.calculation_coefficient != null
          ? Number(initialValues.calculation_coefficient)
          : calculationCoefficient;
      setEdgePrice(
        Math.round(m2e * edgeP * coefToUse + (filoService?.price ?? 0) * m2e)
      );
    }

    // Chapa
    if (initialValues.chapa?.veneerSelect) setVeneerSelectValue(initialValues.chapa.veneerSelect);
    if (initialValues.chapa?.chapa_price) setChapaPrice(String(initialValues.chapa.chapa_price));

    // Materiales (placas)
    if (Array.isArray(initialValues.materials) && initialValues.materials.length > 0) {
      setCountMaterial(initialValues.materials.length);
      const rows = {};
      initialValues.materials.forEach((m, i) => {
        rows[i] = { table: m.table ?? "", qty: m.qty ?? 0, price: m.price ?? 0 };
      });
      setMaterialRows(rows);
    }

    // Items extra
    if (Array.isArray(initialValues.extra_items) && initialValues.extra_items.length > 0) {
      setCountItemExtra(initialValues.extra_items.length);
      const rows = {};
      initialValues.extra_items.forEach((e, i) => {
        rows[i] = { name: e.name ?? "", price: e.price ?? 0 };
      });
      setExtraRows(rows);
    }

    // Ajuste
    if (initialValues.adjustment_reason) setAdjustmentReason(initialValues.adjustment_reason);
    if (initialValues.adjustment_price) setAdjustmentPrice(String(initialValues.adjustment_price));

    // Comentarios
    if (initialValues.comments) setComments(initialValues.comments);

    // Mostrar módulos
    if (initialValues.show_modules) setShowModules(true);

    // Coeficiente por mueble (guardado en edición)
    if (initialValues.calculation_coefficient != null) {
      const rawCoef = String(initialValues.calculation_coefficient).replace(",", ".");
      const coef = Number(rawCoef);
      if (!Number.isNaN(coef) && coef > 0) {
        setSectionCoefficient(coef);
        setSectionCoefficientInput(String(coef));
        userOverriddenCoef.current = true;
      }
    }

    // Envío y colocación por mueble
    if (initialValues.shipment_price != null)
      setItemShipmentPrice(Number(initialValues.shipment_price) || 0);
    if (initialValues.placement_days != null)
      setItemPlacementDays(Number(initialValues.placement_days) || 0);
    if (initialValues.placement_price_per_day != null)
      setItemPlacementPricePerDay(Number(initialValues.placement_price_per_day) || 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
          m2 * edgeP * sectionCoefficient +
            (filoService?.price ?? 0) * m2
        )
      );
    },
    [edges, totalEdgeLength, sectionCoefficient, filoService]
  );

  // Recalculate edge-no-lacquered price when coefficient or service changes
  useEffect(() => {
    const m2 = Number((totalEdgeLength / 100).toFixed(2));
    setEdgeM2(m2);
    setEdgePrice(
      Math.round(
        m2 * materialEdge * sectionCoefficient +
          (filoService?.price ?? 0) * m2
      )
    );
  }, [totalEdgeLength, materialEdge, sectionCoefficient, filoService]);

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
      sub * sectionCoefficient +
      totalQty * (cortePlacaService?.price ?? 0);
    setSubtotalMaterialPrice(sub);
    setTotalMaterialPrice(tot);
  }, [materialRows, sectionCoefficient, cortePlacaService]);

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
    const coef = sectionCoefficient;
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
    sectionCoefficient,
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

  // Notify parent of subtotal change (incluye envío y colocación del ítem)
  const computedPlacementPrice = Number(itemPlacementDays || 0) * Number(itemPlacementPricePerDay || 0);
  const itemTotal = subtotalPrice + Number(itemShipmentPrice || 0) + computedPlacementPrice;
  useEffect(() => {
    onSubtotalChange?.(index, itemTotal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotalPrice, itemShipmentPrice, itemPlacementDays, itemPlacementPricePerDay, index, onSubtotalChange]);

  // ── expose data via ref ─────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    collectErrors() {
      const errs = [];
      if (totalLacqueredEdgeLength > 0 && materialEdgeLaquered === 0)
        errs.push("Falta indicar el grosor de placa para el filo laqueado");
      if (totalPolishedEdgeLength > 0 && materialEdgePolished === 0)
        errs.push("Falta indicar el grosor de placa para el filo lustrado");
      if (totalEdgeLength > 0 && !edgeSelectValue)
        errs.push("No se seleccionó el tipo de filo (sin laquear)");
      if (totalVeneerPolished > 0 && !(Number(chapaPrice) > 0))
        errs.push("Falta ingresar el precio de chapa para el lustrado");
      return errs;
    },
    collectData() {
      const materialsList = Object.values(materialRows).filter((m) => m.table);
      const extraItemsList = Object.values(extraRows).filter((e) => e.name);
      const shipPx = Number(itemShipmentPrice || 0);
      const placePx = Number(itemPlacementDays || 0) * Number(itemPlacementPricePerDay || 0);
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
        shipment_price: shipPx,
        placement_price: placePx,
        placement_days: Number(itemPlacementDays || 0),
        placement_price_per_day: Number(itemPlacementPricePerDay || 0),
        item_total: subtotalPrice + shipPx + placePx,
        show_modules: showModules,
        calculation_coefficient: sectionCoefficient,
      };
    },
    getSubtotal() {
      const plPx = Number(itemPlacementDays || 0) * Number(itemPlacementPricePerDay || 0);
      return subtotalPrice + Number(itemShipmentPrice || 0) + plPx;
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
        onClick={onToggle}
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
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      {isOpen && (
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
                        {!edgeSelectValue ? (
                          <p className="text-orange-500 text-sm">
                            Seleccioná el tipo de filo
                          </p>
                        ) : (
                          <p>
                            {(totalEdgeLength / 100).toFixed(2)} m Precio:{" "}
                            {fmt(
                              (totalEdgeLength / 100) * materialEdge +
                                (filoService?.price ?? 0) *
                                  (totalEdgeLength / 100)
                            )}
                          </p>
                        )}
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
                      {!(Number(chapaPrice) > 0) && (
                        <p className="text-orange-500 text-xs mt-1">
                          Ingresá el precio de chapa
                        </p>
                      )}
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

          {/* ── Coeficiente por mueble ── */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-semibold text-gray-700">
                Coeficiente de cálculo para este mueble:
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sectionCoefficientInput}
                onChange={(e) => setSectionCoefficientInput(e.target.value)}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value.replace(",", "."));
                  if (!Number.isNaN(val) && val > 0) {
                    userOverriddenCoef.current = true;
                    setSectionCoefficient(val);
                  }
                }}
                className="border border-gray-300 rounded-md px-3 py-1.5 w-28 text-sm"
              />
              <span className="text-xs text-gray-500">
                (Global: {calculationCoefficient})
              </span>
            </div>
          </div>

          {/* ── Envío y colocación por mueble ── */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Precio de envío y colocación para este mueble
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Precio de envío</label>
                <input
                  type="number"
                  min="0"
                  value={itemShipmentPrice || ""}
                  onChange={(e) => setItemShipmentPrice(Number(e.target.value) || 0)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-40 text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Días de colocación</label>
                <input
                  type="number"
                  min="0"
                  value={itemPlacementDays || ""}
                  onChange={(e) => setItemPlacementDays(Number(e.target.value) || 0)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-32 text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Precio por día</label>
                <input
                  type="number"
                  min="0"
                  value={itemPlacementPricePerDay || ""}
                  onChange={(e) => setItemPlacementPricePerDay(Number(e.target.value) || 0)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-40 text-sm"
                  placeholder="0"
                />
              </div>
              {(Number(itemShipmentPrice) > 0 || computedPlacementPrice > 0) && (
                <div className="flex flex-col gap-1 justify-end">
                  <span className="text-sm text-gray-500">
                    {Number(itemShipmentPrice) > 0 && <>Envío: {fmt(Number(itemShipmentPrice))}</>}
                    {computedPlacementPrice > 0 && (
                      <> &nbsp;| Colocación: {fmt(computedPlacementPrice)} ({itemPlacementDays} días × {fmt(Number(itemPlacementPricePerDay))})</>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Subtotal del mueble ── */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-lg font-semibold text-emerald-800">
              Subtotal {furnitureData?.name}: {fmt(subtotalPrice)}
            </p>
            {(Number(itemShipmentPrice) > 0 || computedPlacementPrice > 0) && (
              <p className="text-base font-semibold text-emerald-700 mt-1">
                Total con envío/colocación: {fmt(itemTotal)}
              </p>
            )}
          </div>

          {/* ── Despiece por módulo ── */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header con checkbox e toggle de visibilidad */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-700">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-white">
                  Despiece por módulo{" "}
                  {sortedModules.length > 0 && (
                    <span className="text-gray-300 text-sm font-normal">
                      ({sortedModules.length} módulos)
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setShowDespiece((v) => !v)}
                  className="flex items-center gap-1.5 text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-2.5 py-1 rounded transition-colors"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${showDespiece ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showDespiece ? "Ocultar despiece" : "Mostrar despiece"}
                </button>
              </div>
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

            {showDespiece && (sortedModules.length === 0 ? (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export { FurnitureBudgetSection };
