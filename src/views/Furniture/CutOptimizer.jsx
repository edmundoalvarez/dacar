import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import jsPDF from "jspdf";

import {
  getPiecesByFurnitureId,
  getAllTables,
  getFurnitureById,
} from "../../index.js";
import { CutLayoutCanvas } from "../../components/ComponentFurnitures/CutLayoutCanvas.jsx";
import { optimizeCuts } from "../../utils/cutOptimizer/index.js";
import { drawLayout } from "../../utils/cutOptimizer/draw.js";

function CutOptimizer() {
  const { idFurniture } = useParams();

  const [loader, setLoader] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [furnitureName, setFurnitureName] = useState("");
  const [pieces, setPieces] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");

  const [kerf, setKerf] = useState(4);
  const [trim, setTrim] = useState(0);

  const [result, setResult] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);

  const tablesByName = useMemo(() => {
    const map = {};
    tables.forEach((t) => {
      if (t?.name) map[t.name] = t;
    });
    return map;
  }, [tables]);

  // Carga inicial de datos.
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoader(true);
      setError("");
      try {
        const [piecesRes, tablesRes, furnitureRes] = await Promise.all([
          getPiecesByFurnitureId(idFurniture),
          getAllTables(),
          getFurnitureById(idFurniture).catch(() => null),
        ]);
        if (!mounted) return;

        setPieces(Array.isArray(piecesRes?.data) ? piecesRes.data : []);
        setTables(Array.isArray(tablesRes?.data) ? tablesRes.data : []);

        const f = furnitureRes?.data;
        setFurnitureName(f?.name || f?.furniture?.name || "Mueble");
      } catch (e) {
        if (mounted) setError("No se pudieron cargar los datos del mueble.");
        console.error("Error cargando datos del optimizador:", e);
      } finally {
        if (mounted) setLoader(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [idFurniture]);

  const runOptimization = useCallback(() => {
    if (!pieces.length) return;
    setCalculating(true);
    // Cedemos el hilo para que se pinte el loader antes del calculo pesado.
    setTimeout(() => {
      try {
        const kerfNum = Math.max(0, Number(kerf) || 0);
        const trimNum = Math.max(0, Number(trim) || 0);
        const res = optimizeCuts({
          pieces,
          tablesByName,
          kerf: kerfNum,
          trim: trimNum,
          allowRotation: true,
          options: { iterations: 3000 },
        });
        setResult(res);
        setActiveMaterial((prev) => {
          if (prev && res.materials.some((m) => m.material === prev)) return prev;
          return res.materials[0]?.material || null;
        });
      } catch (e) {
        console.error("Error optimizando el corte:", e);
        setError("Ocurrio un error al calcular la optimizacion.");
      } finally {
        setCalculating(false);
      }
    }, 30);
  }, [pieces, tablesByName, kerf, trim]);

  // Primer calculo cuando terminan de cargar los datos.
  useEffect(() => {
    if (!loader && pieces.length && tables.length && !result) {
      runOptimization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, pieces, tables]);

  const activeData = useMemo(
    () => result?.materials.find((m) => m.material === activeMaterial) || null,
    [result, activeMaterial]
  );

  const formatMoney = (n) =>
    (Number(n) || 0).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });

  // ---- Export PDF ----
  const renderBinDataURL = (mat, bin) => {
    const scale = 0.32; // px por mm
    const dpr = 2;
    const canvas = document.createElement("canvas");
    canvas.width = mat.table.length * scale * dpr;
    canvas.height = mat.table.width * scale * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawLayout(ctx, {
      sheetW: mat.table.length,
      sheetH: mat.table.width,
      scale,
      trim: Math.max(0, Number(trim) || 0),
      placements: bin.placements,
    });
    return canvas.toDataURL("image/png");
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 12;
    let first = true;

    result.materials.forEach((mat) => {
      if (!mat.bins.length) return;
      mat.bins.forEach((bin, idx) => {
        if (!first) doc.addPage();
        first = false;

        doc.setFontSize(13);
        doc.text(`Optimizacion de corte - ${furnitureName}`, margin, margin);
        doc.setFontSize(10);
        doc.text(
          `Placa: ${mat.material}  (${mat.table.length} x ${mat.table.width} mm)  -  Lamina ${idx + 1} de ${mat.bins.length}`,
          margin,
          margin + 6
        );

        const url = renderBinDataURL(mat, bin);
        const ratio = mat.table.width / mat.table.length;
        let imgW = pageW - margin * 2;
        let imgH = imgW * ratio;
        const maxH = pageH - margin * 2 - 16;
        if (imgH > maxH) {
          imgH = maxH;
          imgW = imgH / ratio;
        }
        doc.addImage(url, "PNG", margin, margin + 12, imgW, imgH);
      });
    });

    if (first) return; // no habia nada que exportar
    doc.save(`Optimizacion-corte-${furnitureName}.pdf`);
  };

  return (
    <div className="pb-8 px-4 sm:px-8 lg:px-16 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 bg-gray-800 p-4 sm:p-6 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Optimizacion de corte
          </h1>
          <p className="text-emerald-300 text-sm m-0">{furnitureName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={!result || calculating}
            className="bg-sky-700 hover:bg-sky-600 disabled:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Exportar PDF
          </button>
          <Link
            to="/ver-muebles"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Volver a Muebles
          </Link>
        </div>
      </div>

      {/* Panel de parametros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Ancho de sierra / kerf (mm)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={kerf}
            onChange={(e) => setKerf(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-40"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Saneado por borde (mm)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-40"
          />
        </div>
        <button
          onClick={runOptimization}
          disabled={loader || calculating || !pieces.length}
          className="bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
        >
          Recalcular
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {(loader || calculating) && (
        <div className="flex flex-col justify-center items-center py-16 gap-3">
          <Grid
            visible={true}
            height="48"
            width="48"
            color="rgb(4, 120, 87)"
            ariaLabel="grid-loading"
            radius="12.5"
          />
          <p className="text-gray-600 text-sm">
            {loader ? "Cargando despiece..." : "Optimizando corte..."}
          </p>
        </div>
      )}

      {!loader && !calculating && !pieces.length && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
          Este mueble no tiene piezas para optimizar.
        </div>
      )}

      {!loader && !calculating && result && (
        <>
          {/* Resumen total */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 m-0">Materiales</p>
              <p className="text-2xl font-semibold text-gray-800 m-0">
                {result.materials.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 m-0">Placas necesarias</p>
              <p className="text-2xl font-semibold text-gray-800 m-0">
                {result.totals.sheets}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 m-0">Costo estimado</p>
              <p className="text-2xl font-semibold text-gray-800 m-0">
                {formatMoney(result.totals.cost)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 m-0">Piezas sin ubicar</p>
              <p
                className={`text-2xl font-semibold m-0 ${
                  result.totals.unfit > 0 ? "text-red-600" : "text-gray-800"
                }`}
              >
                {result.totals.unfit}
              </p>
            </div>
          </div>

          {/* Tabs por material */}
          <div className="flex flex-wrap gap-2 mb-4">
            {result.materials.map((m) => (
              <button
                key={m.material}
                onClick={() => setActiveMaterial(m.material)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition border ${
                  activeMaterial === m.material
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {m.material}{" "}
                <span className="opacity-80">
                  ({m.stats.sheets} {m.stats.sheets === 1 ? "placa" : "placas"})
                </span>
              </button>
            ))}
          </div>

          {activeData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Stats del material activo */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Placa: </span>
                  <span className="font-semibold text-gray-800">
                    {activeData.table
                      ? `${activeData.table.length} x ${activeData.table.width} mm`
                      : "sin datos"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Placas: </span>
                  <span className="font-semibold text-gray-800">
                    {activeData.stats.sheets}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Aprovechamiento: </span>
                  <span className="font-semibold text-emerald-700">
                    {(100 - activeData.stats.wastePct).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Desperdicio: </span>
                  <span className="font-semibold text-gray-800">
                    {activeData.stats.wastePct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Costo: </span>
                  <span className="font-semibold text-gray-800">
                    {formatMoney(activeData.stats.cost)}
                  </span>
                </div>
              </div>

              {/* Piezas sin ubicar */}
              {activeData.unfit.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
                  <p className="text-sm font-semibold text-red-700 mb-1">
                    {activeData.unfit.length} pieza(s) no se pudieron ubicar
                  </p>
                  <p className="text-xs text-red-600 m-0">
                    {activeData.unfit[0].reason ||
                      "Son mas grandes que la placa disponible."}
                  </p>
                </div>
              )}

              {/* Laminas */}
              {activeData.bins.length === 0 ? (
                <p className="text-gray-600">
                  No hay laminas para mostrar en este material.
                </p>
              ) : (
                <div className="flex flex-wrap gap-6">
                  {activeData.bins.map((bin, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-gray-700 m-0">
                        Lamina {idx + 1} de {activeData.bins.length}
                        <span className="font-normal text-gray-500">
                          {" "}
                          - {bin.placements.length} piezas
                        </span>
                      </p>
                      <CutLayoutCanvas
                        sheetW={activeData.table.length}
                        sheetH={activeData.table.width}
                        trim={Math.max(0, Number(trim) || 0)}
                        placements={bin.placements}
                        maxWidth={520}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { CutOptimizer };
