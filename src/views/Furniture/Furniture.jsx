import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Para soporte de tablas
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import {
  getAllFurnitures,
  filterFurnitureByName,
  getLoosePiecesByFurnitureId,
  getPiecesByFurnitureId,
  deleteFurniture,
  ViewModulesFurniture,
} from "../../index.js";

function Furniture() {
  const [furnitures, setFurnitures] = useState([]);

  const [selectedModules, setSelectedModules] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoader, setSearchLoader] = useState(false);
  const navigate = useNavigate();

  const getAllFurnituresToSet = () => {
    getAllFurnitures()
      .then((furnituresData) => {
        setFurnitures(furnituresData.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getAllFurnituresToSet();
  }, []);

  // Manejar la búsqueda de muebles
  const handleSearch = debounce((term) => {
    if (term.trim() !== "") {
      filterFurnitureByName(term)
        .then((res) => {
          setFurnitures(res.data);
          setLoader(false);
          setSearchLoader(false);
        })
        .catch((error) => {
          setSearchLoader(true);
          console.error("Error al filtrar los muebles:", error);
        });
    } else {
      getAllFurnituresToSet();
      setSearchLoader(false); // Si no hay término de búsqueda, obtener todos los servicios
    }
  }, 800);

  // Actualizar el término de búsqueda y llamar a la función de búsqueda
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setLoader(true);
    setSearchLoader(true);
    handleSearch(e.target.value);
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
        getAllFurnituresToSet();
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

    // Configurar las columnas de la tabla
    const moduleColumns = ["Nombre del Módulo", "Largo", "Ancho", "Alto"];
    const pieceColumns = ["Nombre", "Cantidad", "Largo", "Ancho", "Material"];

    let currentY = 30;

    // Recorrer cada módulo y sus piezas sueltas para generar las filas
    modulesWithLoosePieces.forEach((module) => {
      // Añadir datos del módulo
      const moduleRow = [
        module.moduleName,
        module.moduleLength,
        module.moduleWidth,
        module.moduleHeight,
      ];
      doc.autoTable({
        head: [moduleColumns],
        body: [moduleRow],
        startY: currentY,
        headStyles: { fillColor: [79, 157, 98] },
      });
      currentY = doc.lastAutoTable.finalY + 10; // Ajustar la posición Y para la siguiente tabla

      // Añadir piezas sueltas si existen
      if (module.loosePieces.length > 0) {
        const pieceRows = module.loosePieces.map((piece) => [
          piece.name,
          piece.qty,
          piece.orientation === "cross-horizontal" ? piece.length : piece.width,
          piece.orientation === "cross-horizontal" ? piece.width : piece.length,
          piece.material,
        ]);
        doc.autoTable(pieceColumns, pieceRows, { startY: currentY });
        currentY = doc.lastAutoTable.finalY + 10; // Ajustar la posición Y para la siguiente tabla
      }
    });

    const fileName = `Módulos-y-Piezas-Sueltas-${furnitureName}.pdf`;
    doc.save(fileName);
  };

  const generatePiecesPDF = (pieces, furnitureName) => {
    const doc = new jsPDF();

    // Títulos de las columnas de la tabla
    const tableColumn = ["Nombre", "Cantidad", "Largo", "Alto", "Material"];

    // Mapear los datos de las piezas para las filas de la tabla
    const tableRows = pieces.map((piece) => [
      piece.name,
      piece.qty,
      piece.orientation === "cross-horizontal" ? piece.length : piece.width,
      piece.orientation === "cross-horizontal" ? piece.width : piece.length,
      piece.material,
    ]);

    // Agregar texto al documento
    doc.text(`Despiece del mueble: ${furnitureName}`, 14, 20);

    // Agregar la tabla al documento
    doc.autoTable(tableColumn, tableRows, { startY: 30 });

    // Guardar el documento PDF
    const fileName = `Despiece-${furnitureName}.pdf`;
    doc.save(fileName);
  };

  // funcion descargar piezas sueltas
  const handleDownloadLoosePiece = (furnitureId, furnitureName) => {
    getLoosePiecesByFurnitureId(furnitureId).then((loosePiecesData) => {
      const loosePieces = loosePiecesData.data;
      generateLoosePiecesPDF(loosePieces, furnitureName);
    });
  };
  //funcion descargar despiece
  const handleDownloadPieces = (furnitureId, furnitureName) => {
    getPiecesByFurnitureId(furnitureId).then((piecesData) => {
      const pieces = piecesData.data;
      generatePiecesPDF(pieces, furnitureName);
    });
  };

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl">Muebles</h1>

          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver al Inicio
          </Link>
          <Link
            to="/crear-mueble"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Crear Mueble
          </Link>
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar por nombre"
              className="border border-gray-400 p-2 rounded-lg ml-auto"
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
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
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
                        <button
                          onClick={() => handleOpenModal(furniture)}
                          className=" mt-4 bg-blue-500 text-white py-1 px-6 rounded"
                        >
                          Ver
                        </button>
                      </>
                    ) : (
                      <p>Sin Módulos</p>
                    )}
                  </td>

                  <td>
                    <div className="flex flex-col gap-2 items-center py-8 w-8/12 m-auto">
                      <Link
                        to={`/presupuestar-mueble/${furniture._id}`}
                        className="text-white bg-emerald-700 hover:bg-emerald-900 rounded-md px-2 py-1 mb-2 text-center w-full"
                      >
                        Presupuestar
                      </Link>
                      <div className="flex gap-2 w-full">
                        <Link
                          to={`/editar-modulos-mueble/${furniture._id}`}
                          className="text-white bg-orange hover:bg-amber-600 rounded-md px-2 py-1 mb-2 text-center flex-1"
                        >
                          Editar
                        </Link>
                        <button
                          className="text-white bg-red-700 rounded-md px-2 py-1 mb-2 flex-1"
                          onClick={() => handleDeleteFurniture(furniture._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          handleDownloadPieces(furniture._id, furniture.name)
                        }
                        className="text-white bg-sky-800 hover:bg-sky-950 rounded-md px-2 py-1 mb-2 text-center w-full"
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Despiece
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadLoosePiece(
                            furniture._id,
                            furniture.name
                          )
                        }
                        className="text-white bg-gray-700 hover:bg-gray-800 rounded-md px-2 py-1 mb-2 text-center w-full"
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Piezas Sueltas
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center w-full mt-8">
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
    </>
  );
}

export { Furniture };
