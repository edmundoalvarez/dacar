import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getAllPieces,
  getAllTables,
  deletePiece,
  getModuleById,
  FormCreatePieces,
  updateModulePiecesNumber,
  createPieces,
} from "../../index.js";

function Pieces() {
  const { moduleId } = useParams();
  const [pieces, setPieces] = useState([]);
  const [module, setModule] = useState([]);
  const [tables, setTables] = useState([]);
  const [showAddPiece, setShowAddPiece] = useState(false);
  const getAllPiecesToSet = () => {
    getAllPieces()
      .then((piecesData) => {
        const filteredPieces = piecesData.data.filter(
          (piece) => piece.module_id === moduleId
        );
        setPieces(filteredPieces);
        // console.log(filteredPieces);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getModuleToSet = () => {
    getModuleById(moduleId)
      .then((moduleData) => {
        setModule(moduleData.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // TRAER PLACAS: para el formulario de las piezas, se le pasar por prop
  const getAllTablesToSet = () => {
    getAllTables()
      .then((tablesData) => {
        setTables(tablesData.data);
        // console.log(tablesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };
  // FORMULARIO PARA CREAR
  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors },
  } = useForm();
  //Eliminar pieza
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState(null);

  function handleDeletePiece(pieceId) {
    setOpenModalToDelete(true);
    setPieceToDelete(pieceId);
  }
  function deleteSinglePiece(pieceId) {
    deletePiece(pieceId)
      .then((res) => {
        getAllPiecesToSet();
        let newPiecesNumber = module.pieces_number - 1;
        updateModulePiecesNumber(moduleId, newPiecesNumber);
        // console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar la pieza
    setOpenModalToDelete(false);
    setPieceToDelete(null);
  }

  //traer las placas
  useEffect(() => {
    getAllPiecesToSet();
    getAllTablesToSet();
  }, []);

  useEffect(() => {
    getModuleToSet();
  }, []);

  //ON SUBMIT PARA CREAR PIEZA A AGREGAR
  const onSubmit = async (data, event) => {
    event.preventDefault();
    try {
      let lacqueredPiece;
      let veneer;
      let melamine;
      if (data[`finishing1`] === "lacqueredPiece") {
        lacqueredPiece = true;
        veneer = false;
        melamine = false;
      }
      if (data[`finishing1`] === "veneer") {
        lacqueredPiece = false;
        veneer = true;
        melamine = false;
      }
      if (data[`finishing1`] === "melamine") {
        lacqueredPiece = false;
        veneer = false;
        melamine = true;
      }
      const pieceData = {
        // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
        name: data[`namePiece1`],
        length: data[`lengthPiece1`],
        width: data[`widthPiece1`],
        orientation: data[`orientation1`],
        category: data[`categoryPiece1`],
        material: data[`materialPiece1`],
        lacqueredPiece: lacqueredPiece,
        lacqueredPieceSides: data[`lacqueredPieceSides1`],
        veneer: veneer,
        veneerFinishing: data[`veneerOption1`],
        melamine: melamine,
        melamineLacquered: data[`melamineLacquered1`],
        pantographed: data[`pantographed1`],
        edgeLength: data[`edgeLength1`],
        edgeLengthSides: data[`edgeLengthSides1`],
        edgeWidth: data[`edgeWidth1`],
        edgeWidthSides: data[`edgeWidthSides1`],
        lacqueredEdge: data[`lacqueredEdge1`],
        loose_piece: data[`loose_piece1`],
        moduleId, // Asigna el ID del módulo a cada pieza
      };
      await createPieces(pieceData);
      setShowAddPiece(false);
      getAllPiecesToSet();
      let newPiecesNumber = module.pieces_number + 1;
      updateModulePiecesNumber(moduleId, newPiecesNumber);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="my-4">
        <div className="flex gap-4 px-8">
          <h1 className="text-4xl">Piezas del módulo: {module.name}</h1>
          <Link
            to={`/editar-modulo/${module._id}`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver al módulo
          </Link>
          <Link
            to="/ver-modulos"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Ir los Módulos
          </Link>
          <button
            className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
            onClick={() => setShowAddPiece(true)}
          >
            Agregar pieza
          </button>
        </div>
        {/* crear pieza */}
        {showAddPiece && (
          <>
            <form
              action=""
              className="flex flex-wrap w-full px-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormCreatePieces
                key={`FormCreatePiecess${1}`}
                register={register}
                index={1}
                errors={errors}
                tables={tables}
                resetField={resetField}
              ></FormCreatePieces>
              <div className="flex gap-6">
                <button
                  className="bg-orange hover:bg-amber-500 text-white py-1 px-2 rounded"
                  type="submit"
                >
                  Agregar pieza
                </button>
                <button
                  className="bg-dark py-2 px-4 rounded hover:bg-emerald-600 text-light font-medium "
                  onClick={() => setShowAddPiece(false)}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
        <div className="overflow-x-auto mt-4">
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
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Largo
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Material
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Acabado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Filo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Accion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pieces.map((piece) => (
                <tr key={piece.name} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.width}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p>
                      {piece.lacqueredPiece ? (
                        <>
                          Laqueado
                          {piece.lacqueredPieceSides === "single" &&
                            " (1 lado)"}
                          {piece.lacqueredPieceSides === "double" &&
                            " (2 lados)"}{" "}
                          <br></br>
                          {piece.pantographed ? "Pantografiado" : ""}
                        </>
                      ) : piece.veneer ? (
                        <>
                          Enchapado<br></br>
                          {piece.veneerFinishing &&
                          piece.veneerFinishing === "veneerLacquered"
                            ? "Laqueado"
                            : piece.veneerFinishing &&
                              piece.veneerFinishing === "veneerPolished"
                            ? "Lustrado"
                            : ""}
                        </>
                      ) : piece.melamine ? (
                        <>
                          Melamina
                          <br />
                          {piece.melamineLacquered ? "Laqueada" : ""}
                        </>
                      ) : (
                        "No indica"
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {piece.edge && piece.edge.edgeLength ? (
                      <p>
                        {piece.edge.edgeLength} cm{" "}
                        {piece.edge.lacqueredEdge ? "(Laqueado)" : ""}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex justify-center items-center gap-x-4">
                      {/*    <Link
                        to={`
                        `}
                        className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                      >
                        Editar
                      </Link> */}
                      <button
                        className="text-white bg-red-500 rounded-md px-2 py-1 mb-2"
                        onClick={() => handleDeletePiece(piece._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openModalToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar la pieza?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSinglePiece(pieceToDelete)}
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

export { Pieces };
