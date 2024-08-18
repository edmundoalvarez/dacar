import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
  getAllFurnitures,
  filterFurnitureByName,
  getLoosePiecesByFurnitureId,
  getPiecesByFurnitureId,
} from "../../index.js";

function Furniture() {
  const [furnitures, setFurnitures] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
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
  const handleOpenModal = (furniture, module) => {
    setSelectedFurniture(furniture);
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFurniture(null);
    setSelectedModule(null);
    setIsModalOpen(false);
  };

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  function generateLoosePiecesPDF(loosePieces, furnitureName) {
    const tableBody = [
      // Definimos los títulos de las columnas
      [
        { text: "Nombre", bold: true },
        { text: "Alto", bold: true },
        { text: "Largo", bold: true },
        { text: "Material", bold: true },
      ],
    ];

    // Agregamos las filas de la tabla
    loosePieces.forEach((piece) => {
      tableBody.push([piece.name, piece.length, piece.width, piece.material]);
    });

    const documentDefinition = {
      content: [
        { text: "Piezas sueltas", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"], // Distribuye las columnas uniformemente
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
      },
    };
    let fileName = "Piezas-Sueltas-" + furnitureName + ".pdf";
    pdfMake.createPdf(documentDefinition).download(fileName);
  }

  function generatePiecesPDF(pieces, furnitureName) {
    const tableBody = [
      // Definimos los títulos de las columnas
      [
        { text: "Nombre", bold: true },
        { text: "Alto", bold: true },
        { text: "Largo", bold: true },
        { text: "Material", bold: true },
      ],
    ];

    // Agregamos las filas de la tabla
    pieces.forEach((piece) => {
      tableBody.push([piece.name, piece.length, piece.width, piece.material]);
    });

    const documentDefinition = {
      content: [
        { text: "Despiece del mueble " + furnitureName, style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"], // Distribuye las columnas uniformemente
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
      },
    };
    let fileName = "Despiece-" + furnitureName + ".pdf";
    pdfMake.createPdf(documentDefinition).download(fileName);
  }

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
              className="border p-2 rounded-lg ml-auto"
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
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Largo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Profundidad
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Módulos
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {furnitures.map((furniture) => (
                <tr key={furniture._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.width}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {furniture.category}
                  </td>
                  <td className="px-6 whitespace-nowrap text-sm text-gray-500 flex flex-col gap-0">
                    {Array.isArray(furniture.modules_furniture) ? (
                      furniture.modules_furniture.map((module, index) => (
                        <div
                          key={module._id || index}
                          className={`flex flex-col items-start py-4 ${
                            index < furniture.modules_furniture.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <p className="w-[140px]">{module.name}</p>
                            <button
                              onClick={() => handleOpenModal(furniture, module)}
                              className="ml-2 bg-blue-500 text-white py-1 px-2 rounded"
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Sin Módulos</p>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-col gap-2 items-center">
                      <Link
                        to={`/editar-modulos-mueble/${furniture._id}
                        `}
                        className="text-white bg-orange hover:bg-amber-600 rounded-md px-2 py-1 mb-2 text-center w-1/2"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/presupuestar-mueble/${furniture._id}
                        `}
                        className="text-white bg-emerald-500 hover:bg-emerald-600 rounded-md px-2 py-1 mb-2 text-center w-1/2"
                      >
                        Presupuestar
                      </Link>

                      <button
                        onClick={() =>
                          handleDownloadPieces(furniture._id, furniture.name)
                        }
                        className="text-white bg-sky-800 hover:bg-sky-950 rounded-md px-2 py-1 mb-2 text-center w-1/2"
                      >
                        Descargar despiece
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadLoosePiece(
                            furniture._id,
                            furniture.name
                          )
                        }
                        className="text-white bg-gray-700 hover:bg-gray-800 rounded-md px-2 py-1 mb-2 text-center w-1/2"
                      >
                        Descargar piezas sueltas
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col max-h-screen overflow-y-auto">
            <h2 className="text-xl mb-4">
              <b>Detalles del Módulo</b>
            </h2>
            {selectedModule && (
              <div className="mb-2">
                <p>
                  <strong>Nombre:</strong> {selectedModule.name}
                </p>
                <p>
                  <strong>Largo:</strong> {selectedModule.length}
                </p>
                <p>
                  <strong>Profundidad:</strong> {selectedModule.width}
                </p>
                <p>
                  <strong>Alto:</strong> {selectedModule.height}
                </p>
                <p>
                  <strong>Categoría:</strong> {selectedModule.category}
                </p>
                <h2 className="text-xl bg-blue-500 text-white w-fit px-2 my-2 rounded-lg">
                  Insumos del modulo
                </h2>
                {selectedModule.supplies_module.map((supplie) => (
                  <ul key={supplie.supplie_id} className="my-2">
                    <li>
                      <strong>Nombre:</strong> {supplie.supplie_name}
                    </li>
                    <li>
                      <strong>Cantidad:</strong> {supplie.supplie_qty}
                    </li>
                    <li>
                      <strong>Largo:</strong> {supplie?.supplie_length}
                    </li>
                  </ul>
                ))}
              </div>
            )}
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
    </>
  );
}

export { Furniture };
