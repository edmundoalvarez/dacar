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

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors },
  } = useForm();

  //Eliminar pieza
  const [openModalToDelete, setOpenModalToDelete] = useState(false);
  const [pieceToDelete, setPieceToDelete] = useState({ id: null, qty: 0 });

  function handleDeletePiece(pieceId, pieceQty) {
    setOpenModalToDelete(true);
    setPieceToDelete({ id: pieceId, qty: pieceQty });
  }
  async function deleteSinglePiece({ id, qty }) {
    try {
      // Llamada a la función de eliminación de la pieza
      await deletePiece(id);

      // Obtener nuevamente todas las piezas después de la eliminación
      getAllPiecesToSet();

      console.log("qty a borrar: ", qty);

      // Calcular el nuevo número de piezas y actualizar el módulo
      let newPiecesNumber = module.pieces_number - qty;
      await updateModulePiecesNumber(moduleId, newPiecesNumber);

      // Obtener los datos actualizados del módulo
      getModuleToSet();
    } catch (error) {
      console.error(error);
    } finally {
      // Cerrar la modal después de eliminar la pieza y limpiar el estado
      setOpenModalToDelete(false);
      setPieceToDelete({ id: null, qty: 0 });
    }
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
      let veneer2;
      let melamine;
      if (data[`finishing1`] === "lacqueredPiece") {
        lacqueredPiece = true;
        veneer = false;
        veneer2 = false;
        melamine = false;
      }
      if (data[`finishing1`] === "veneer") {
        lacqueredPiece = false;
        veneer = true;
        veneer2 = false;
        melamine = false;
      }
      if (data[`finishing1`] === "veneer2") {
        lacqueredPiece = false;
        veneer = false;
        veneer2 = true;
        melamine = false;
      }
      if (data[`finishing1`] === "melamine") {
        lacqueredPiece = false;
        veneer = false;
        veneer2 = false;
        melamine = true;
      }

      let lacqueredEdge = false;
      let polishedEdge = false;

      if (data[`edgeType1`] === "lacquered") {
        lacqueredEdge = true;
      }

      if (data[`edgeType1`] === "polished") {
        polishedEdge = true;
      }

      let qty =
        data[`qty1`] !== undefined &&
        data[`qty1`] !== "" &&
        Number(data[`qty1`]) !== 0
          ? Number(data[`qty1`])
          : 1;

      const pieceData = {
        // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
        name: data[`namePiece1`],
        qty: qty,
        length: data[`lengthPiece1`],
        width: data[`widthPiece1`],
        orientation: data[`orientation1`],
        comment: data[`commentPiece1`],
        material: data[`materialPiece1`],
        lacqueredPiece: lacqueredPiece,
        lacqueredPieceSides: data[`lacqueredPieceSides1`],
        veneer: veneer,
        veneerFinishing: data[`veneerOption1`],
        veneerLacqueredPieceSides: data[`veneerLacqueredPieceSides1`],
        veneer2: veneer2,
        veneer2Finishing: data[`veneer2Option1`],
        veneer2LacqueredPieceSides: data[`veneer2LacqueredPieceSides1`],
        melamine: melamine,
        melamineLacquered: data[`melamineLacquered1`],
        melamineLacqueredPieceSides: Number(
          data[`melamineLacqueredPieceSides1`]
        ),
        pantographed: data[`pantographed1`],
        edgeLength: data[`edgeLength1`],
        edgeLengthSides: data[`edgeLengthSides1`],
        edgeWidth: data[`edgeWidth1`],
        edgeWidthSides: data[`edgeWidthSides1`],
        lacqueredEdge: lacqueredEdge,
        polishedEdge: polishedEdge,
        loose_piece: data[`loose_piece1`],
        moduleId, // Asigna el ID del módulo a cada pieza
      };
      console.log(pieceData);
      await createPieces(pieceData);
      setShowAddPiece(false);
      getAllPiecesToSet();
      // console.log("module.pieces_number", module.pieces_number, "qty", qty);
      let newPiecesNumber = module.pieces_number + qty;
      await updateModulePiecesNumber(moduleId, newPiecesNumber);
      getModuleToSet();
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
                key={`FormCreatePieces${1}`}
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
                  className="px-2 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Cantidad
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
                  Comentario
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
                  Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Orientación
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
                  Filo Largo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Filo Alto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-light uppercase tracking-wider"
                >
                  Tipo de filo
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
                <tr key={piece._id} className="text-center">
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
                    {/* {piece.length} */}
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
                        )}{" "}
                        <br></br>
                        {piece.pantographed ? (
                          <strong>Pantografiado</strong>
                        ) : (
                          ""
                        )}
                      </>
                    ) : piece.veneer ? (
                      <>
                        Enchapado Artesanal<br></br>
                        {piece.veneerFinishing &&
                        piece.veneerFinishing === "veneerLacquered" &&
                        piece.veneerLacqueredPieceSides === 1 ? (
                          <strong>
                            Laqueado Poro abierto<br></br>1 lado
                          </strong>
                        ) : piece.veneerFinishing &&
                          piece.veneerFinishing === "veneerLacquered" &&
                          piece.veneerLacqueredPieceSides === 2 ? (
                          <strong>
                            Laqueado Poro abierto<br></br>2 lados
                          </strong>
                        ) : piece.veneerFinishing &&
                          piece.veneerFinishing === "veneerPolished" ? (
                          <strong>Lustrado</strong>
                        ) : (
                          ""
                        )}
                      </>
                    ) : piece.veneer2 ? (
                      <>
                        Enchapado No Artesanal<br></br>
                        {piece.veneer2Finishing &&
                        piece.veneer2Finishing === "veneer2Lacquered" &&
                        piece.veneer2LacqueredPieceSides === 1 ? (
                          <strong>
                            Laqueado Poro abierto<br></br>1 lado
                          </strong>
                        ) : piece.veneer2Finishing &&
                          piece.veneer2Finishing === "veneer2Lacquered" &&
                          piece.veneer2LacqueredPieceSides === 2 ? (
                          <strong>
                            Laqueado Poro abierto<br></br>2 lados
                          </strong>
                        ) : piece.veneer2Finishing &&
                          piece.veneer2Finishing === "veneer2Polished" ? (
                          <strong>Lustrado</strong>
                        ) : (
                          ""
                        )}
                      </>
                    ) : piece.melamine ? (
                      <>
                        Melamina
                        <br />
                        {piece.melamineLacquered ? (
                          <strong>Laqueada</strong>
                        ) : (
                          ""
                        )}
                        <br />
                        {piece.melamineLacqueredPieceSides === 1 && (
                          <strong> 1 lado</strong>
                        )}
                        {piece.melamineLacqueredPieceSides === 2 && (
                          <strong>2 lados</strong>
                        )}{" "}
                      </>
                    ) : (
                      "No indica"
                    )}
                  </td>

                  <td className="px-4 py-2 text-center border-b">
                    {piece.edgeLength
                      ? `Sí, ${
                          piece.edgeLengthSides === "1"
                            ? "un lado"
                            : piece.edgeLengthSides === "2"
                            ? "dos lados"
                            : "falta cantidad lados"
                        }`
                      : "No"}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {piece.edgeWidth
                      ? `Sí, ${
                          piece.edgeWidthSides === "1"
                            ? "un lado"
                            : piece.edgeWidthSides === "2"
                            ? "dos lados"
                            : "falta cantidad lados"
                        }`
                      : "No"}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {piece.lacqueredEdge ? "Sí" : "No"}
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
                        onClick={() => handleDeletePiece(piece._id, piece.qty)}
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
