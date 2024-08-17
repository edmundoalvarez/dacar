import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import {
  getFurnitureById,
  EditFurnitureSingleModuleComponent,
  EditFurnitureComponent,
  deleteModuleOnFurniture,
} from "../../index.js";

function EditFurnitureMultipleModules() {
  const [singleFurniture, setSingleFurniture] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [furnitureToEdit, setFurnitureToEdit] = useState(null);
  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //eliminar modulo
  const [openModalToDeleteModule, setOpenModalToDeleteModule] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const navigate = useNavigate();
  const { idFurniture } = useParams();

  const getFurnituresToSet = () => {
    getFurnitureById(idFurniture)
      .then((furnituresData) => {
        setSingleFurniture(furnituresData.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getFurnituresToSet();
  }, []);

  // Handle modal for viewing module details
  const handleOpenModal = (module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedModule(null);
    setIsModalOpen(false);
  };

  // Handle editing a module
  const handleEditModule = (singleFurniture, module) => {
    setFurnitureToEdit(singleFurniture);
    setModuleToEdit(module);
  };

  // Handle editing a furniture
  const handleEditFurniture = (singleFurniture) => {
    setFurnitureToEdit(singleFurniture);
  };

  //Cuando el modulo es modificado y se desrenderice
  const handleModification = () => {
    setModuleToEdit(null);
    setFurnitureToEdit(null);
    getFurnituresToSet();
  };
  const closeComponentEdit = () => {
    setModuleToEdit(null);
    setFurnitureToEdit(null);
  };

  //eliminar modulo
  function handleDeleteModule(furnitureId, moduleId) {
    setOpenModalToDeleteModule(true);
    setModuleToDelete({ furnitureId, moduleId });
  }
  function deleteSingleModule(furnitureIdmoduleId) {
    // console.log("furnitureIdmoduleId", furnitureIdmoduleId);
    let furnitureId = furnitureIdmoduleId.furnitureId;
    let moduleId = furnitureIdmoduleId.moduleId;
    deleteModuleOnFurniture(furnitureId, moduleId)
      .then((res) => {
        getFurnituresToSet();
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Cerrar la modal después de eliminar el modulo
    setOpenModalToDeleteModule(false);
    setModuleToDelete(null);
  }

  return (
    <>
      <div className="m-4">
        <div className="flex gap-4">
          <h1 className="text-4xl">Mueble: {singleFurniture.name}</h1>
          <Link
            to="/ver-muebles"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Volver a muebles
          </Link>
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
                  Categoría
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
                >
                  Editar Mueble
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr key={singleFurniture._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {singleFurniture.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {singleFurniture.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {singleFurniture.width}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {singleFurniture.height}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {singleFurniture.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditFurniture(singleFurniture._id)}
                    className="ml-2 bg-lightblue text-white py-1 px-2 rounded"
                  >
                    Editar
                  </button>
                </td>
              </tr>
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
          {/* modulos */}

          <div className="px-6 whitespace-nowrap text-sm text-gray-500">
            {Array.isArray(singleFurniture.modules_furniture) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {singleFurniture.modules_furniture
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente
                  .map((module, index) => (
                    <div
                      key={module._id || index}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col items-start"
                    >
                      <p className="mb-2 font-bold">{module.name}</p>
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleOpenModal(module)}
                          className="bg-blue-500 text-white py-1 px-2 rounded"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() =>
                            handleEditModule(singleFurniture._id, module._id)
                          }
                          className="bg-orange text-white py-1 px-2 rounded"
                        >
                          Editar Módulo
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteModule(singleFurniture._id, module._id)
                          }
                          className="bg-red-500 text-white py-1 px-2 rounded"
                        >
                          Eliminar Módulo
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              ""
            )}
          </div>

          {/* fin modulos */}
        </div>
      </div>
      {/* modal de desea eliminar el modulo */}
      {openModalToDeleteModule && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl mb-4">
              ¿Seguro que desea eliminar la pieza?
            </h2>
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => deleteSingleModule(moduleToDelete)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => setOpenModalToDeleteModule(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de ver el moulo */}
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
                <h2 className="text-xl bg-blue-500 text-white w-fit px-2 my-2 rounded-lg">
                  Piezas del modulo
                </h2>
                {selectedModule.pieces.map((piece) => (
                  <ul key={piece._id} className="my-2">
                    <li>
                      <strong>Nombre:</strong> {piece.name}
                    </li>
                    <li>
                      <strong>Orientación:</strong>{" "}
                      {piece.orientation === "cross-vertical"
                        ? "Transversal Vertical"
                        : piece.orientation === "cross-horizontal"
                        ? "Transversal Horizontal"
                        : piece.orientation === "side"
                        ? "Lateral"
                        : ""}
                    </li>
                    <li>
                      <strong>
                        {" "}
                        {piece.orientation === "cross-vertical"
                          ? "Alto:"
                          : piece.orientation === "cross-horizontal"
                          ? "Profundidad:"
                          : piece.orientation === "side"
                          ? "Alto:"
                          : ""}
                      </strong>{" "}
                      {piece.length}
                    </li>
                    <li>
                      <strong>
                        {piece.orientation === "cross-vertical"
                          ? "Largo:"
                          : piece.orientation === "cross-horizontal"
                          ? "Largo:"
                          : piece.orientation === "side"
                          ? "Profundidad:"
                          : ""}
                      </strong>{" "}
                      {piece.width}
                    </li>
                    <li>
                      <strong>Categoría:</strong> {piece.category}
                    </li>
                    <li>
                      <strong>Material:</strong> {piece.material}
                    </li>
                    <li>
                      <strong>Acabado:</strong>{" "}
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
                    </li>
                    <li>
                      <strong>Filo:</strong>{" "}
                      {piece.edge && piece.edge.edgeLength ? (
                        <>
                          {piece.edge.edgeLength} cm{" "}
                          {piece.edge.lacqueredEdge ? "(Laqueado)" : ""}
                        </>
                      ) : (
                        ""
                      )}
                    </li>

                    <hr className="border border-gray-400" />
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

      {moduleToEdit && (
        <EditFurnitureSingleModuleComponent
          idFurniture={furnitureToEdit}
          idModule={moduleToEdit}
          onModified={handleModification}
          notModified={closeComponentEdit}
        />
      )}

      {furnitureToEdit && !moduleToEdit && (
        <EditFurnitureComponent
          idFurniture={furnitureToEdit}
          onModified={handleModification}
          notModified={closeComponentEdit}
        />
      )}
    </>
  );
}

export { EditFurnitureMultipleModules };
