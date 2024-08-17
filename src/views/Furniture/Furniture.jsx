import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Grid, Oval } from "react-loader-spinner";
import { getAllFurnitures, filterFurnitureByName } from "../../index.js";

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

  // Manejador del botón Editar
  const handleDownloadLoosePiece = (furnitureId, moduleId) => {
    // console.log("Id mueble:", furnitureId);
    // console.log("Id modulo:", moduleId);
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
                  className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider"
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
                    <div className="flex gap-2">
                      <Link
                        to={`/editar-modulos-mueble/${furniture._id}
                        `}
                        className="text-white bg-orange rounded-md px-2 py-1 mb-2"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/presupuestar-mueble/${furniture._id}
                        `}
                        className="text-white bg-lightblue rounded-md px-2 py-1 mb-2"
                      >
                        Presupuestar
                      </Link>
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
                onClick={() =>
                  handleDownloadLoosePiece(
                    selectedFurniture._id,
                    selectedModule._id
                  )
                }
                className="text-white bg-orange py-2 px-4 rounded"
              >
                Descargar piezas sueltas
              </button>
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
