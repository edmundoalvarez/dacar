import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs"; //Para transformar en excel

import {
  getAllFurnituresList,
  getLoosePiecesByFurnitureId,
  getPiecesByFurnitureId,
  deleteFurniture,
  ViewModulesFurniture,
  getFurnitureHistory,
} from "../../index.js";

function Furniture() {
  const ENV = import.meta.env.VITE_ENV; //variable para determinar si esta en TEST o PROD

  const [furnitures, setFurnitures] = useState([]);

  const [selectedModules, setSelectedModules] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);

  // Historial de edicion
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoader, setHistoryLoader] = useState(false);
  const [historyFurnitureName, setHistoryFurnitureName] = useState("");
  const [historyFurnitureId, setHistoryFurnitureId] = useState(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50; // Límite de insumos por página

  // Guardamos el AbortController actual para abortar la request previa
  const controllerRef = useRef(null);
  // (Opcional) sequence para evitar respuestas fuera de orden
  const reqSeqRef = useRef(0);

  const getAllFurnituresToSet = useCallback(
    async (term = "", page = 1, { showMainLoader = false } = {}) => {
      // abortar request previa
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const seq = ++reqSeqRef.current; // id de request

      if (showMainLoader) setLoader(true);

      try {
        const data = await getAllFurnituresList(
          term,
          page,
          itemsPerPage,
          controller.signal
        );
        // Si se abortó o llegó fuera de orden, no toques el estado
        if (!data || seq !== reqSeqRef.current) return;

        setFurnitures(data.furnitures);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (e) {
        // si no fue una cancelación, ya lo loguea el service
      } finally {
        setLoader(false);
        setSearchLoader(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    getAllFurnituresToSet(searchTerm, currentPage, { showMainLoader: true });
  }, [currentPage, getAllFurnituresToSet]);

  // Manejar la búsqueda de muebles
  // Debounce estable (se crea 1 sola vez)
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        // al buscar, siempre volvemos a página 1
        // Importante: como setState es async, le pasamos directamente page=1 a la fetch
        getAllFurnituresToSet(term, 1);
        setCurrentPage(1);
      }, 800),
    [getAllFurnituresToSet]
  );

  useEffect(() => {
    // cleanup: cancelar el debounce y la request si desmonta
    return () => {
      debouncedSearch.cancel();
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [debouncedSearch]);
  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchLoader(true);
    debouncedSearch(term);
  };

  // Manejo de la ventana modal
  const handleOpenModal = (furniture) => {
    //ORDENAR POR NOMBRE LOS MÓDULOS
    const sortedModules = furniture.modules_furniture?.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    // console.log(sortedModules);
    setSelectedModules(sortedModules);
    setIsModalOpen(true);
  };

  // Paginación con mismo término activo
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllFurnituresToSet(searchTerm, currentPage - 1, {
        showMainLoader: true,
      });
      setCurrentPage((p) => p - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllFurnituresToSet(searchTerm, currentPage + 1, {
        showMainLoader: true,
      });
      setCurrentPage((p) => p + 1);
    }
  };

  const handleCloseModal = () => {
    setSelectedModules(null);
    setIsModalOpen(false);
  };

  //Eliminar mueble
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [furnitureToDelete, setFurnitureToDelete] = useState(null);

  function handleDeleteFurniture(furnitureId) {
    setOpenModalToDelete(true);
    setFurnitureToDelete(furnitureId);
  }

  function deleteSingleFurniture(furnitureId) {
    deleteFurniture(furnitureId)
      .then((res) => {
        getAllFurnituresToSet(searchTerm, currentPage);
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setFurnitureToDelete(null);
  }

  //GENERAR PDFs

  const generateLoosePiecesPDF = (modulesWithLoosePieces, furnitureName) => {
    const doc = new jsPDF();

    doc.text(`Módulos y Piezas Sueltas: ${furnitureName}`, 14, 20);

    // Columnas de las tablas
    const moduleColumns = ["Nombre del Módulo", "Largo", "Ancho", "Alto"];
    const pieceColumns = ["Nombre", "Cantidad", "Largo", "Ancho", "Material"];

    let currentY = 30;

    modulesWithLoosePieces.forEach((module) => {
      // Fila con datos del módulo
      const moduleRow = [
        [
          module.moduleName,
          module.moduleLength,
          module.moduleWidth,
          module.moduleHeight,
        ],
      ];

      autoTable(doc, {
        head: [moduleColumns],
        body: moduleRow,
        startY: currentY,
        headStyles: { fillColor: [79, 157, 98] },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      if (module.loosePieces.length > 0) {
        const pieceRows = module.loosePieces.map((piece) => [
          piece.name,
          piece.qty,
          piece.orientation === "cross-horizontal" ? piece.length : piece.width,
          piece.orientation === "cross-horizontal" ? piece.width : piece.length,
          piece.material,
        ]);

        autoTable(doc, {
          head: [pieceColumns],
          body: pieceRows,
          startY: currentY,
        });

        currentY = doc.lastAutoTable.finalY + 10;
      }
    });

    const fileName = `Módulos-y-Piezas-Sueltas-${furnitureName}.pdf`;
    doc.save(fileName);
  };

  // funcion descargar piezas sueltas
  const handleDownloadLoosePiece = (furnitureId, furnitureName) => {
    getLoosePiecesByFurnitureId(furnitureId).then((loosePiecesData) => {
      const loosePieces = loosePiecesData.data;
      generateLoosePiecesPDF(loosePieces, furnitureName);
    });
  };

  const generatePiecesExcelByMaterial = async (pieces, furnitureName) => {
    // Agrupar las piezas por material
    const piecesByMaterial = pieces.reduce((acc, piece) => {
      if (!acc[piece.material]) {
        acc[piece.material] = [];
      }
      acc[piece.material].push(piece);
      return acc;
    }, {});

    // Iterar sobre cada material y generar un archivo Excel
    for (const [material, materialPieces] of Object.entries(piecesByMaterial)) {
      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Piezas");

      // Agregar títulos de las columnas
      worksheet.columns = [
        { header: "#", key: "index", width: 5 },
        {
          header: "Largo",
          key: "length",
          width: 10,
        },
        { header: "Ancho", key: "width", width: 10 },
        {
          header: "Cantidad",
          key: "qty",
          width: 10,
        },
        { header: "Rotación", key: "rotation", width: 20 },
        { header: "Nombre", key: "name", width: 20 },
        { header: "Material", key: "material", width: 20 },
      ];
      worksheet.getColumn("length").numFmt = "@"; // Forzar como texto
      worksheet.getColumn("width").numFmt = "@"; // Forzar como texto
      // Mapear los datos de las piezas del material actual y agregarlos al worksheet
      materialPieces.forEach((piece, index) => {
        worksheet.addRow({
          index: index + 1,
          length:
            piece.orientation === "cross-horizontal"
              ? piece.length.toString()
              : piece.width.toString(),
          width:
            piece.orientation === "cross-horizontal"
              ? piece.width.toString()
              : piece.length.toString(),
          qty: piece.qty,
          rotation: "",
          name: piece.name,
          material: piece.material,
        });
      });

      // Aplicar estilos opcionales (opcional)
      worksheet.getRow(1).font = { bold: true }; // Hacer la cabecera en negritas

      // Generar archivo Excel y descargarlo
      const fileName = `Despiece - ${furnitureName} - ${material}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer(); // Escribir en un buffer
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Crear enlace para descargar el archivo
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para descargar los archivos por material
  const handleDownloadPieces = (furnitureId, furnitureName) => {
    getPiecesByFurnitureId(furnitureId).then((piecesData) => {
      const pieces = piecesData.data;
      generatePiecesExcelByMaterial(pieces, furnitureName);
    });
  };

  // Historial de edicion
  const FIELD_LABELS = {
    name: "Nombre del mueble",
    length: "Largo",
    height: "Alto",
    width: "Profundidad",
    category: "Categoría",
    modules_count: "Cantidad de módulos",
  };

  function getFieldLabel(field) {
    return FIELD_LABELS[field] || field;
  }

  function formatChangeValue(change, key) {
    const val = change[key];

    if (!val) return "—";

    // Si es string ISO de fecha
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      try {
        const date = new Date(val);
        return date.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return val;
      }
    }

    if (typeof val !== "object") {
      return String(val);
    }

    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }

  const handleOpenHistory = async (furniture) => {
    try {
      setHistoryFurnitureName(furniture.name);
      setHistoryFurnitureId(furniture._id);
      setHistoryModalOpen(true);
      setHistoryLoader(true);

      const logs = await getFurnitureHistory(furniture._id);
      setHistoryEntries(logs);
    } catch (err) {
      console.error("Error al obtener historial del mueble:", err);
    } finally {
      setHistoryLoader(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryEntries([]);
    setHistoryFurnitureName("");
    setHistoryFurnitureId(null);
  };

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500 shadow-sm">
          <h1 className="text-4xl font-semibold text-white">Muebles</h1>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
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
              wrapperStyle={{}}
              wrapperClass=""
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
            <Link
              to="/crear-mueble"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center gap-2"
            >
              <img
                src="./icon_add.svg"
                alt="Icono de budgets"
                className="w-[20px]"
              />
              <p className="m-0 leading-loose">Crear Mueble</p>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Largo
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Alto
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Profundidad
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Módulos
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                  >
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {furnitures.map((furniture) => (
                  <tr key={furniture._id}>
                    <td className="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {furniture.name}
                    </td>
                    <td className="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {furniture.length}
                    </td>
                    <td className="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {furniture.height}
                    </td>
                    <td className="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {furniture.width}
                    </td>

                    <td className="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {furniture.category}
                    </td>
                    <td className="px-2 py-4 text-center text-sm whitespace-nowrap max-w-[140px] text-gray-500">
                      {Array.isArray(furniture.modules_furniture) &&
                      furniture.modules_furniture.length > 0 ? (
                        <>
                          <div className="flex flex-wrap justify-center text-left w-full ">
                            <p className=" max-w-[180px] flex flex-wrap ">
                              {furniture.modules_furniture.map(
                                (module, index) => (
                                  <span key={index} className="truncate">
                                    {module.name}
                                    {index <
                                      furniture.modules_furniture.length - 1 &&
                                      ","}
                                  </span>
                                )
                              )}
                            </p>
                          </div>
                          <div className="mt-4 w-full flex flex-col justify-center items-center align-middle">
                            <button
                              onClick={() => handleOpenModal(furniture)}
                              className="w-2/3 text-white  bg-blue-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                            >
                              Ver
                            </button>
                          </div>
                        </>
                      ) : (
                        <p>Sin Módulos</p>
                      )}
                    </td>

                    <td>
                      <div className="flex flex-col gap-2 items-center py-8 w-7/12 m-auto">
                        <div className="flex flex-row gap-2 w-full">
                          <Link
                            to={`/presupuestar-mueble/${furniture._id}`}
                            className="w-full text-white bg-emerald-700 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-3"
                          >
                            <img
                              src="./../icon_budgets.svg"
                              alt="Icono de budgets"
                              className="w-[18px]"
                            />
                            <p className="m-0 leading-loose">Presupuestar</p>
                          </Link>
                        </div>

                        <div className="flex flex-row gap-2 w-full">
                          <Link
                            to={`/editar-modulos-mueble/${furniture._id}`}
                            className="w-1/2 text-white bg-orange rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          >
                            <img
                              src="./../icon_edit.svg"
                              alt="Icono editar mueble"
                              className="w-[20px]"
                            />
                            <p className="m-0 leading-loose">Editar</p>
                          </Link>
                          <button
                            onClick={() => handleDeleteFurniture(furniture._id)}
                            className="w-1/2 text-white bg-red-500 rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          >
                            <img
                              src="./../icon_delete.svg"
                              alt="Icono eliminar mueble"
                              className="w-[18px]"
                            />
                            <p className="m-0 leading-loose">Eliminar</p>
                          </button>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={() =>
                              handleDownloadPieces(
                                furniture._id,
                                furniture.name
                              )
                            }
                            className="w-full text-white bg-sky-800  rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faDownload}
                              className="w-[18px]"
                              size="lg"
                            />
                            <p className="m-0 leading-loose">Despiece</p>
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadLoosePiece(
                                furniture._id,
                                furniture.name
                              )
                            }
                            className="w-FULL text-white bg-gray-700  rounded-md px-3 py-0.5 flex flex-row justify-center align-middle items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faDownload}
                              className="mr-2"
                              size="lg"
                            />
                            <p className="m-0 leading-loose">Piezas Sueltas</p>
                          </button>
                        </div>

                        {/* NUEVO: botón Historial */}
                        <div className="flex flex-row gap-2 w-full">
                          <button
                            onClick={() => handleOpenHistory(furniture)}
                            className="w-full text-white bg-gray-900 rounded-md px-3 py-0.5 flex flex-row justify-center items-center gap-2"
                          >
                            <img
                              src="./../icon_history.svg"
                              alt="Historial del mueble"
                              className="w-[16px]"
                            />
                            <p className="m-0 leading-loose text-sm">
                              Historial
                            </p>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
            <Grid
              visible={loader}
              height="80"
              width="80"
              color="rgb(92, 92, 92)"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass="grid-wrapper"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 py-8 text-black">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
                        ${
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
            className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-300 
                        ${
                          currentPage === totalPages
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-700"
                        }`}
          >
            Siguiente
          </button>
        </div>
      </div>
      {/* Abrimos la modal en caso que el estado isModalOpen cambie */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal} // Cierra la modal si se hace clic fuera de ella
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro de la modal la cierre
            className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-[550px] overflow-y-auto relative m-8"
          >
            {/* Botón de cierre en la esquina superior derecha */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-md w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            {/* Contenido de la modal */}
            <ViewModulesFurniture sortedModules={selectedModules} />

            <div className="flex justify-center items-center m-auto gap-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar el mueble?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleFurniture(furnitureToDelete)}
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
      {/* Modal historial de mueble */}
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
              Historial de cambios – {historyFurnitureName}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              ID mueble:{" "}
              <span className="font-mono text-xs">{historyFurnitureId}</span>
            </p>

            {historyLoader ? (
              <div className="flex justify-center items-center h-32">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="rgb(92, 92, 92)"
                  secondaryColor="rgb(92,92,92)"
                  strokeWidth="6"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : historyEntries.length === 0 ? (
              <p className="text-sm text-gray-600">
                No hay actividad registrada.
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
                          : log.action === "update" &&
                            log.meta?.changeType === "module_update"
                          ? "Edición de módulo"
                          : log.action === "update" &&
                            log.meta?.changeType === "module_deleted"
                          ? "Eliminación de módulo"
                          : log.action === "update" &&
                            log.meta?.changeType === "modules_added"
                          ? "Agregado de módulos"
                          : log.action === "update"
                          ? "Actualización"
                          : log.action === "delete"
                          ? "Eliminación"
                          : log.action === "clone"
                          ? "Clonación"
                          : log.action}
                      </span>

                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString("es-AR")}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 mb-2">
                      <span className="font-medium">Usuario: </span>
                      {log.user?.username ||
                        log.user?.email ||
                        "Usuario desconocido"}
                    </div>

                    {/* Mensaje específico para módulos agregados */}
                    {log.action === "update" &&
                      log.meta?.changeType === "modules_added" &&
                      Array.isArray(log.meta.addedModules) &&
                      log.meta.addedModules.length > 0 && (
                        <div className="text-xs text-gray-700 mb-2">
                          <p className="mb-1">
                            Se agregaron los siguientes módulos al mueble:
                          </p>
                          <ul className="list-disc ml-4">
                            {log.meta.addedModules.map((mod) => (
                              <li key={mod.moduleId}>{mod.moduleName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {/* Mensaje específico para edición / eliminación de módulo dentro del mueble */}
                    {log.action === "update" &&
                      log.meta?.changeType === "module_update" && (
                        <p className="text-xs text-gray-700 mb-2">
                          Se editó el módulo{" "}
                          <span className="font-semibold">
                            {log.meta.moduleName}
                          </span>{" "}
                          dentro del mueble.
                        </p>
                      )}

                    {log.action === "update" &&
                      log.meta?.changeType === "module_deleted" && (
                        <p className="text-xs text-gray-700 mb-2">
                          Se eliminó el módulo{" "}
                          <span className="font-semibold">
                            {log.meta.moduleName}
                          </span>{" "}
                          del mueble.
                        </p>
                      )}

                    {/* Si es creación, mostrar meta */}
                    {log.action === "create" && log.meta && (
                      <div className="text-xs text-gray-700">
                        <span className="font-medium">Datos iniciales:</span>
                        <pre className="mt-1 bg-gray-50 p-2 rounded text-[11px] whitespace-pre-wrap">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Si es actualización, mostrar cambios (para cuando tengas update con log) */}
                    {log.action === "update" &&
                      Array.isArray(log.changes) &&
                      log.changes.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-xs">
                            Cambios realizados:
                          </span>
                          <table className="mt-1 w-full text-[11px] border border-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border px-2 py-1 text-left">
                                  Campo
                                </th>
                                <th className="border px-2 py-1 text-left">
                                  Antes
                                </th>
                                <th className="border px-2 py-1 text-left">
                                  Después
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {log.changes.map((change, idx) => (
                                <tr key={idx}>
                                  <td className="border px-2 py-1 align-top">
                                    {getFieldLabel(change.field)}
                                  </td>
                                  <td className="border px-2 py-1 align-top">
                                    {formatChangeValue(change, "from")}
                                  </td>
                                  <td className="border px-2 py-1 align-top">
                                    {formatChangeValue(change, "to")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
    </>
  );
}

export { Furniture };
