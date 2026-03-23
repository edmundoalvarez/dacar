import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import ExcelJS from "exceljs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  getAllBudgets,
  deleteBudget,
  getBudgetHistory,
  confirmBudget,
  getAllEdgesSupplies,
  getAllVeneerSupplies,
} from "../../index.js";

function Budgets() {
  const ENV = import.meta.env.VITE_ENV;

  const [budgets, setBudgets] = useState([]);
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  // AbortController de la request en curso
  const controllerRef = useRef(null);
  const reqSeqRef = useRef(0);
  const edgesMapRef = useRef({});
  const veneersMapRef = useRef({});
  const catalogsLoadedRef = useRef(false);

  // --------- CONFIRMAR PRESUPUESTOS ----------
  const [openModalToConfirm, setOpenModalToConfirm] = useState(false);
  const [budgetToConfirm, setBudgetToConfirm] = useState(null);
  const [budgetToConfirmNumber, setBudgetToConfirmNumber] = useState(null);
  const [confirmLoader, setConfirmLoader] = useState(false);

  // --------- HISTORIAL PRESUPUESTOS ----------
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoader, setHistoryLoader] = useState(false);
  const [historyBudgetNumber, setHistoryBudgetNumber] = useState(null);
  const [historyBudgetId, setHistoryBudgetId] = useState(null);

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getAllBudgetsToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current;

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllBudgets(
          term,
          page,
          itemsPerPage,
          controller.signal
        );
        if (!data || seq !== reqSeqRef.current) return;

        setBudgets(data.budgets);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (_) {
        // el service ya loguea
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  // Al entrar/volver a la lista (o al paginar), aseguramos scroll arriba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [currentPage]);

  useEffect(() => {
    getAllBudgetsToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, searchTerm, getAllBudgetsToSet]);

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        getAllBudgetsToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getAllBudgetsToSet]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllBudgetsToSet(searchTerm, currentPage - 1, { showMainLoader: true });
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllBudgetsToSet(searchTerm, currentPage + 1, { showMainLoader: true });
      setCurrentPage((p) => p + 1);
    }
  };

  const normalizeBudgetSection = (section) => {
    if (Array.isArray(section)) return section[0] || {};
    if (section && typeof section === "object") return section;
    return {};
  };

  const ensureMaterialsCatalogs = async () => {
    if (catalogsLoadedRef.current) {
      return {
        edgesMap: edgesMapRef.current,
        veneersMap: veneersMapRef.current,
      };
    }

    try {
      const [edgesRes, veneersRes] = await Promise.all([
        getAllEdgesSupplies(),
        getAllVeneerSupplies(),
      ]);

      const edgesMap = (edgesRes?.data || []).reduce((acc, edge) => {
        acc[edge._id] = edge.name;
        return acc;
      }, {});
      const veneersMap = (veneersRes?.data || []).reduce((acc, veneer) => {
        acc[veneer._id] = veneer.name;
        return acc;
      }, {});

      edgesMapRef.current = edgesMap;
      veneersMapRef.current = veneersMap;
      catalogsLoadedRef.current = true;

      return { edgesMap, veneersMap };
    } catch (error) {
      console.error("Error cargando catálogos de materiales:", error);
      return {
        edgesMap: edgesMapRef.current,
        veneersMap: veneersMapRef.current,
      };
    }
  };

  const generateMaterialOrderExcel = async (budget, catalogs) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Lista de materiales");

    const client = budget?.client?.[0];
    const clientName = client
      ? `${client.name || ""} ${client.lastname || ""}`.trim()
      : "—";
    const furnitureName =
      budget?.furniture_name ||
      budget?.furniture?.[0]?.name ||
      "Mueble";

    const address = client?.address || "";
    const orderNumber = budget?.budget_number
      ? String(budget.budget_number).padStart(6, "0")
      : "";
    const requestDate = budget?.date
      ? new Date(budget.date).toLocaleDateString("es-AR")
      : "";

    worksheet.properties.defaultRowHeight = 18;
    worksheet.views = [{ showGridLines: false }];

    // Ajuste de anchos para que entren labels largos (ej: "UBICACIÓN DE OBRA", "FECHA DE SOLICITUD")
    worksheet.columns = [
      { width: 2.5 }, // A (margen)
      { width: 22 }, // B (labels)
      { width: 34 }, // C
      { width: 12 }, // D
      { width: 24 }, // E (labels largos)
      { width: 18 }, // F (valores)
    ];

    const setBorder = (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    };

    // ExcelJS requiere color en ARGB (8 dígitos)
    const fillGray = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };

    worksheet.mergeCells("B2", "D3");
    const titleCell = worksheet.getCell("B2");
    titleCell.value = "ORDEN DE PEDIDO MATERIAL";
    titleCell.font = { bold: true, size: 12 };
    titleCell.alignment = { vertical: "middle" };
    setBorder(titleCell);
    setBorder(worksheet.getCell("D3"));

    worksheet.mergeCells("E2", "F3");
    const orderNumberCell = worksheet.getCell("E2");
    orderNumberCell.value = budget?.budget_number || "";
    orderNumberCell.font = { bold: true, size: 16, color: { argb: "1F4E79" } };
    orderNumberCell.alignment = {
      vertical: "middle",
      horizontal: "right",
    };
    setBorder(orderNumberCell);
    setBorder(worksheet.getCell("F3"));

    worksheet.getRow(4).height = 4;

    worksheet.getCell("B5").value = "CLIENTE:";
    worksheet.getCell("B5").fill = fillGray;
    worksheet.getCell("B5").font = { bold: true };
    worksheet.getCell("B5").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C5", "F5");
    worksheet.getCell("C5").value = clientName;
    worksheet.getCell("C5").alignment = { vertical: "middle" };
    ["B5", "C5", "F5"].forEach((cell) => setBorder(worksheet.getCell(cell)));

    worksheet.getCell("B6").value = "DIRECCIÓN:";
    worksheet.getCell("B6").fill = fillGray;
    worksheet.getCell("B6").font = { bold: true };
    worksheet.getCell("B6").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C6", "F6");
    worksheet.getCell("C6").value = address;
    worksheet.getCell("C6").alignment = { vertical: "middle" };
    ["B6", "C6", "F6"].forEach((cell) => setBorder(worksheet.getCell(cell)));

    worksheet.getRow(7).height = 6;

    worksheet.getRow(8).height = 20;
    worksheet.getCell("B8").value = "OBRA:";
    worksheet.getCell("B8").fill = fillGray;
    worksheet.getCell("B8").font = { bold: true };
    worksheet.getCell("B8").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C8", "D8");
    worksheet.getCell("C8").value = furnitureName;
    worksheet.getCell("C8").alignment = { vertical: "middle" };
    worksheet.getCell("E8").value = "NUMERO DE ORDEN:";
    worksheet.getCell("E8").fill = fillGray;
    worksheet.getCell("E8").font = { bold: true };
    worksheet.getCell("E8").alignment = { vertical: "middle", wrapText: true };
    worksheet.getCell("F8").value = orderNumber;
    worksheet.getCell("F8").alignment = { vertical: "middle", horizontal: "right" };
    ["B8", "C8", "D8", "E8", "F8"].forEach((cell) =>
      setBorder(worksheet.getCell(cell))
    );

    worksheet.getCell("B9").value = "UBICACIÓN DE OBRA";
    worksheet.getCell("B9").fill = fillGray;
    worksheet.getCell("B9").font = { bold: true };
    worksheet.getCell("B9").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C9", "D9");
    worksheet.getCell("E9").value = "FECHA DE SOLICITUD:";
    worksheet.getCell("E9").fill = fillGray;
    worksheet.getCell("E9").font = { bold: true };
    worksheet.getCell("E9").alignment = { vertical: "middle", wrapText: true };
    worksheet.getCell("F9").value = requestDate;
    worksheet.getCell("F9").alignment = { vertical: "middle", horizontal: "right" };
    ["B9", "C9", "D9", "E9", "F9"].forEach((cell) =>
      setBorder(worksheet.getCell(cell))
    );

    // Para que "FECHA ESTIMADA DE LLEGADA DE MATERIAL:" quede en 2 líneas como el ejemplo
    worksheet.getRow(10).height = 34;
    worksheet.getCell("B10").value = "ORDEN SOLICITADA POR:";
    worksheet.getCell("B10").fill = fillGray;
    worksheet.getCell("B10").font = { bold: true };
    worksheet.getCell("B10").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C10", "D10");
    worksheet.getCell("C10").value = budget?.username || "";
    worksheet.getCell("C10").alignment = { vertical: "middle" };
    worksheet.getCell("E10").value = "FECHA ESTIMADA DE LLEGADA DE MATERIAL:";
    worksheet.getCell("E10").fill = fillGray;
    worksheet.getCell("E10").font = { bold: true };
    worksheet.getCell("E10").alignment = { vertical: "middle", wrapText: true };
    worksheet.getCell("F10").value = budget?.deliver_date || "";
    worksheet.getCell("F10").alignment = { vertical: "middle" };
    ["B10", "C10", "D10", "E10", "F10"].forEach((cell) =>
      setBorder(worksheet.getCell(cell))
    );

    worksheet.getRow(11).height = 28;
    worksheet.getCell("B11").value = "RECIBIDO Y CONTROLADO POR:";
    worksheet.getCell("B11").fill = fillGray;
    worksheet.getCell("B11").font = { bold: true };
    worksheet.getCell("B11").alignment = { vertical: "middle", wrapText: true };
    worksheet.mergeCells("C11", "D11");
    worksheet.getCell("E11").value = "FECHA DE CONTROL:";
    worksheet.getCell("E11").fill = fillGray;
    worksheet.getCell("E11").font = { bold: true };
    worksheet.getCell("E11").alignment = { vertical: "middle", wrapText: true };
    ["B11", "C11", "D11", "E11", "F11"].forEach((cell) =>
      setBorder(worksheet.getCell(cell))
    );

    worksheet.getRow(12).height = 6;

    worksheet.mergeCells("B13", "C13");
    worksheet.mergeCells("D13", "E13");
    worksheet.getCell("B13").value = "MATERIAL";
    worksheet.getCell("D13").value = "INFORMACION DEL MATERIAL";
    worksheet.getCell("F13").value = "UNIDADES";
    ["B13", "D13", "F13"].forEach((cell) => {
      const current = worksheet.getCell(cell);
      current.font = { bold: true };
      current.alignment = { horizontal: "center" };
      current.fill = fillGray;
      setBorder(current);
    });
    setBorder(worksheet.getCell("C13"));
    setBorder(worksheet.getCell("E13"));

    const addItem = (tipo, descripcion, unidades) => {
      const rowIndex = worksheet.lastRow.number + 1;
      worksheet.mergeCells(`B${rowIndex}`, `C${rowIndex}`);
      worksheet.mergeCells(`D${rowIndex}`, `E${rowIndex}`);
      worksheet.getCell(`B${rowIndex}`).value = tipo;
      worksheet.getCell(`D${rowIndex}`).value = descripcion || "—";
      worksheet.getCell(`F${rowIndex}`).value = unidades ?? "";
      ["B", "C", "D", "E", "F"].forEach((col) =>
        setBorder(worksheet.getCell(`${col}${rowIndex}`))
      );
    };

    const materials = Array.isArray(budget?.materials) ? budget.materials : [];
    materials.forEach((material) => {
      addItem("Placas", material.table || "—", material.qty ?? "");
    });

    const supplies = Array.isArray(budget?.supplies) ? budget.supplies : [];
    supplies.forEach((supplie) => {
      const hasQty =
        supplie.qty !== undefined && supplie.qty !== null && supplie.qty !== "";
      const hasLength =
        supplie.length !== undefined &&
        supplie.length !== null &&
        supplie.length !== "";
      const qtyValue = hasQty ? supplie.qty : "";
      const lengthValue = hasLength ? `${supplie.length}m` : "";

      // Priorizar cantidad en unidades; usar metros solo si no hay cantidad.
      const units = qtyValue !== "" ? qtyValue : lengthValue;
      addItem("Insumo", supplie.name || "—", units);
    });

    const edgeLacquered = normalizeBudgetSection(budget?.edge_lacquered);
    const edgePolished = normalizeBudgetSection(budget?.edge_polished);
    const edgeRegular = normalizeBudgetSection(budget?.edge_no_lacquered);

    if (edgeLacquered?.edgeLaqueredM2) {
      addItem(
        "Filo",
        "Filo laqueado",
        `${edgeLacquered.edgeLaqueredM2}m2`
      );
    }

    if (edgePolished?.edgePolishedM2) {
      addItem(
        "Filo",
        "Filo pulido",
        `${edgePolished.edgePolishedM2}m2`
      );
    }

    if (edgeRegular?.edgeM2) {
      const edgeName =
        catalogs?.edgesMap?.[edgeRegular.edgeSelect] ||
        edgeRegular.edgeSelect ||
        "Filo";
      addItem("Filo", edgeName, `${edgeRegular.edgeM2}m`);
    }

    const chapa = normalizeBudgetSection(budget?.chapa);
    const veneer = normalizeBudgetSection(budget?.veneer);
    if (chapa?.veneerSelect || veneer?.veneerM2) {
      const veneerName =
        catalogs?.veneersMap?.[chapa.veneerSelect] ||
        chapa.veneerSelect ||
        "Chapa";
      const veneerMeasure = veneer?.veneerM2 ? `${veneer.veneerM2}m2` : "";
      addItem("Chapa", veneerName, veneerMeasure);
    }

    const safeFurnitureName = String(furnitureName).replace(
      /[\\/:*?"<>|]/g,
      "-"
    );
    const fileName = `Orden-de-Pedido-Material-${budget?.budget_number || ""}-${
      safeFurnitureName || "Mueble"
    }.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMaterialOrder = async (budget) => {
    try {
      const catalogs = await ensureMaterialsCatalogs();
      await generateMaterialOrderExcel(budget, catalogs);
    } catch (error) {
      console.error("Error generando descarga:", error);
      alert("Ocurrió un error al generar los archivos.");
    }
  };

  // Eliminar presupuesto
  function handleDeleteBudget(budgetId) {
    setOpenModalToDelete(true);
    setBudgetToDelete(budgetId);
  }

  function deleteSingleBudget(budgetId) {
    deleteBudget(budgetId)
      .then(() => {
        getAllBudgetsToSet(searchTerm, currentPage, { showMainLoader: true });
      })
      .catch((error) => {
        console.error(error);
      });

    setOpenModalToDelete(false);
    setBudgetToDelete(null);
  }

  // ---------- HISTORIAL: abrir / cerrar ----------
  const handleOpenHistory = async (budget) => {
    try {
      setHistoryBudgetNumber(budget.budget_number);
      setHistoryBudgetId(budget._id);
      setHistoryModalOpen(true);
      setHistoryLoader(true);

      const logs = await getBudgetHistory(budget._id);
      setHistoryEntries(logs || []);
    } catch (err) {
      console.error("Error al obtener historial del presupuesto:", err);
      setHistoryEntries([]);
    } finally {
      setHistoryLoader(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryEntries([]);
    setHistoryBudgetNumber(null);
    setHistoryBudgetId(null);
  };

  // --------- CONFIRMAR PRESUPUESTOS ----------
  function handleOpenConfirmBudget(budget) {
    setBudgetToConfirm(budget._id);
    setBudgetToConfirmNumber(budget.budget_number);
    setOpenModalToConfirm(true);
  }

  function handleCloseConfirmModal() {
    setOpenModalToConfirm(false);
    setBudgetToConfirm(null);
    setBudgetToConfirmNumber(null);
    setConfirmLoader(false);
  }

  async function confirmSingleBudget() {
    if (!budgetToConfirm) return;

    try {
      setConfirmLoader(true);

      await confirmBudget(budgetToConfirm);

      // recargo la lista; el presupuesto confirmado ya no se trae
      await getAllBudgetsToSet(searchTerm, currentPage, {
        showMainLoader: true,
      });

      handleCloseConfirmModal();
    } catch (error) {
      console.error("Error confirmando presupuesto:", error);
      alert("Ocurrió un error al confirmar el presupuesto.");
      setConfirmLoader(false);
    }
  }

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Presupuestos</h1>

          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre de cliente"
              className="border border-gray-300 p-2 rounded-lg ml-auto shadow-md w-[400px]"
            />
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

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img
                src="./icon_back.svg"
                alt="Icono de budgets"
                className="w-[20px]"
              />
              <p className="m-0 leading-loose">Volver al Inicio</p>
            </Link>
          </div>
        </div>

        {ENV === "TEST" && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
            ⚠️ Estás en entorno de pruebas (TEST)
          </div>
        )}

        <div className="overflow-x-auto mt-4">
          <div className="overflow-x-auto mt-4 rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Nombre del mueble
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map((budget) => (
                  <tr key={budget._id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.budget_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(budget.date).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.client.map((client) => (
                        <div key={client._id}>
                          {client.name} {client.lastname}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.furniture_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center align-middle gap-2">
                        <Link
                          className="text-white bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          to={`/ver-presupuestos/${budget._id}?from=general`}
                        >
                          <img
                            src="./../icon_search.svg"
                            alt="Ver"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Ver</p>
                        </Link>

                        <Link
                          to={`/editar-presupuestos/${budget._id}?from=general`}
                          className="text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_edit.svg"
                            alt="Editar"
                            className="w-[20px]"
                          />
                          <p className="m-0 leading-loose">Editar</p>
                        </Link>
                        <button
                          onClick={() => handleOpenConfirmBudget(budget)}
                          className="text-white bg-emerald-700 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_check.svg" // poné el ícono que tengas
                            alt="Confirmar"
                            className="w-[16px]"
                          />
                          <p className="m-0 leading-loose text-sm">Confirmar</p>
                        </button>

                        <button
                          onClick={() => handleDeleteBudget(budget._id)}
                          className="text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_delete.svg"
                            alt="Eliminar"
                            className="w-[18px]"
                          />
                          <p className="m-0 leading-loose">Eliminar</p>
                        </button>
                        {/* BOTÓN HISTORIAL */}
                        <button
                          onClick={() => handleOpenHistory(budget)}
                          className="text-white bg-gray-900 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <img
                            src="./../icon_history.svg"
                            alt="Historial"
                            className="w-[16px]"
                          />
                          <p className="m-0 leading-loose text-sm">Historial</p>
                        </button>
                        <button
                          onClick={() => handleDownloadMaterialOrder(budget)}
                          className="text-white bg-gray-700 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                        >
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="w-[14px]"
                            size="sm"
                          />
                          <p className="m-0 leading-loose text-sm">
                            O. Pedido Material
                          </p>
                        </button>
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
        </div>

        <div className="flex justify-center items-center gap-4 py-8 text-black">
          <button
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
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

      {/* Modal eliminar */}
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el presupuesto?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleBudget(budgetToDelete)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => setOpenModalToDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal historial de presupuesto */}
      {historyModalOpen && (
        <div
          onClick={handleCloseHistoryModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-lg shadow-lg max-h-[600px] w-full max-w-3xl overflow-y-auto relative text-black"
          >
            <button
              onClick={handleCloseHistoryModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-2">
              Historial de presupuesto Nº {historyBudgetNumber}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              ID presupuesto:{" "}
              <span className="font-mono text-xs">{historyBudgetId}</span>
            </p>

            {historyLoader ? (
              <div className="flex justify-center items-center h-32">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="rgb(92, 92, 92)"
                  secondaryColor="rgb(92, 92, 92)"
                  strokeWidth="6"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : historyEntries.length === 0 ? (
              <p className="text-sm text-gray-600">
                No hay actividad registrada para este presupuesto.
                <br />
                Es posible que haya sido creado antes de implementar el
                historial.
              </p>
            ) : (
              <ul className="space-y-4">
                {historyEntries.map((log) => (
                  <li
                    key={log._id}
                    className="border border-gray-200 rounded-md p-3 text-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">
                        {log.action === "create"
                          ? "Creación"
                          : log.action === "update"
                          ? "Actualización"
                          : log.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 mb-1">
                      <span className="font-bold">Usuario: </span>
                      {log.user?.username ||
                        log.user?.email ||
                        "Usuario desconocido"}
                    </div>

                    {log.meta && (
                      <div className="text-xs text-gray-700">
                        {log.meta.clientName && (
                          <p className="m-0">
                            <span className="font-bold">Cliente: </span>
                            {log.meta.clientName}
                          </p>
                        )}
                        {log.meta.changeType === "budget_create" && (
                          <p className="m-0">
                            Presupuesto creado en el sistema.
                          </p>
                        )}
                        {log.meta.changeType === "budget_update" && (
                          <p className="m-0">
                            Presupuesto editado en el sistema.
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseHistoryModal}
                className="bg-red-500 text-white py-2 px-6 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal confirmar presupuesto */}
      {openModalToConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col text-black max-w-md w-full">
            <h2 className="text-xl mb-4 text-center font-semibold">
              ¿Seguro que deseas marcar como confirmado el presupuesto
              {budgetToConfirmNumber ? ` Nº ${budgetToConfirmNumber}` : ""}?
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Una vez confirmado, este presupuesto dejará de mostrarse en esta
              lista y aparecerá en el reporte de presupuestos confirmados.
            </p>

            <div className="flex gap-4 items-center">
              <button
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={confirmSingleBudget}
                disabled={confirmLoader}
              >
                {confirmLoader && (
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="rgb(255,255,255)"
                    secondaryColor="rgb(230,230,230)"
                    strokeWidth="6"
                    ariaLabel="oval-loading"
                  />
                )}
                <span>Confirmar</span>
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-4 rounded"
                onClick={handleCloseConfirmModal}
                disabled={confirmLoader}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Budgets };
