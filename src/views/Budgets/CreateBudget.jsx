import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getFurnitureById,
  getAllTables,
  FormCreateClient,
  createClient,
  getAllClients,
} from "../../index.js";

function CreateBudget() {
  const { idFurniture } = useParams();
  const [singleFurniture, setSingleFurniture] = useState(null);
  const [countMaterial, setCountMaterial] = useState(0);
  const [tables, setTables] = useState([]);
  const [clientOption, setClientOption] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [furnitureSupplies, setFurnitureSupplies] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getFurnituresToSet = () => {
    getFurnitureById(idFurniture)
      .then((furnituresData) => {
        setSingleFurniture(furnituresData.data);
        console.log(furnituresData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  // TRAER PLACAS: para select de materiales
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

  // TRAER CLIENTES: para select de clientes
  const getAllClientsToSet = () => {
    getAllClients()
      .then((clientsData) => {
        setAllClients(clientsData.data);
        // console.log(tablesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  useEffect(() => {
    getFurnituresToSet();
    getAllTablesToSet();
  }, [idFurniture]);

  //filtro de clientes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClients([]);
    } else {
      const results = allClients.filter((client) =>
        `${client.lastname} ${client.name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredClients(results);
    }
  }, [searchTerm, allClients]);

  if (!singleFurniture) return <div>Loading...</div>;

  //CÁLCULO TOTAL DE FILO
  const calculateTotalEdges = (modules) => {
    let totalEdgeLength = 0;
    let totalLacqueredEdgeLength = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.edgeLength) {
          if (!piece.lacqueredEdge) {
            totalEdgeLength += piece.edgeLengthSides * piece.length;
          }
          if (piece.lacqueredEdge) {
            totalLacqueredEdgeLength += piece.edgeLengthSides * piece.length;
          }
        }
        if (piece.edgeWidth) {
          if (!piece.lacqueredEdge) {
            totalEdgeLength += piece.edgeWidthSides * piece.width;
          }

          if (piece.lacqueredEdge) {
            totalLacqueredEdgeLength += piece.edgeWidthSides * piece.width;
          }
        }
      });
    });

    return {
      totalEdgeLength,
      totalLacqueredEdgeLength,
    };
  };

  const { totalEdgeLength, totalLacqueredEdgeLength } = calculateTotalEdges(
    singleFurniture.modules_furniture
  );
  //CÁLCULO DE TOTAL PIEZAS ENCHAPADAS EN METROS CUADRADOS
  const calculateTotalVeneer = (modules) => {
    let totalVeneerPolished = 0;
    let totalVeneerLacquered = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.veneer) {
          if (piece.veneerFinishing === "veneerLacquered") {
            totalVeneerPolished += piece.length * piece.width * 1.2;
          }
          if (piece.veneerFinishing === "veneerPolished") {
            totalVeneerPolished += piece.length * piece.width * 1.2;
          }
        }
      });
    });

    return {
      totalVeneerPolished,
      totalVeneerLacquered,
    };
  };
  const { totalVeneerPolished, totalVeneerLacquered } = calculateTotalVeneer(
    singleFurniture.modules_furniture
  );

  //CÁLCULO DE TOTAL PIEZAS LAQUEADAS EN METROS CUADRADOS
  const calculateTotalLacquered = (modules) => {
    let totalLacquered = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.lacqueredPiece) {
          if (piece.lacqueredPieceSides === "single") {
            totalLacquered += piece.length * piece.width;
          }
          if (piece.lacqueredPieceSides === "double") {
            totalLacquered += piece.length * piece.width * 2;
          }
        }
      });
    });

    return {
      totalLacquered,
    };
  };
  const { totalLacquered } = calculateTotalLacquered(
    singleFurniture.modules_furniture
  );

  //CÁLCULO DE TOTAL PIEZAS PANTOGRAFIADAS EN METROS CUADRADOS
  const calculateTotalPantographed = (modules) => {
    let totalPantographed = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.pantographed) {
          totalPantographed += piece.length * piece.width;
        }
      });
    });

    return {
      totalPantographed,
    };
  };
  const { totalPantographed } = calculateTotalPantographed(
    singleFurniture.modules_furniture
  );

  //ORDENAR POR NOMBRE LOS MÓDULOS
  const sortedModules = singleFurniture.modules_furniture?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  //CANTIDAD DE PLACAS
  function counterMaterial(e) {
    const action = e.target.innerText;
    let count;
    if (action === "+") {
      count = countMaterial + 1;
    } else if (action === "-" && countMaterial > 0) {
      count = countMaterial - 1;
    } else {
      count = 0;
    }
    setCountMaterial(count);
  }

  //OPCION SELECCIONAR O CARGAR CLIENTE
  const handleClientOption = (event) => {
    setClientOption(event.target.value);
    if (event.target.value === "existing") {
      getAllClientsToSet();
    }
  };
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    // Aquí puedes filtrar los clientes basados en `event.target.value`
    const filtered = allClients.filter((client) =>
      `${client.lastname} ${client.name}`
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleClientSelect = (client) => {
    setValue("clientNameInput", `${client.lastname} ${client.name}`);
    setValue("clientId", client._id);
    setFilteredClients([]);
  };

  //FORMULARIO GENERAR PRESUPUESTO
  const onSubmit = async (data, event) => {
    event.preventDefault();
    console.log("data formulario", data);
    let clientId;
    /* carga cliente */
    if (clientOption === "new") {
      try {
        await createClient({
          ...data,
        }).then((res) => {
          clientId = res.data._id;
          console.log("clientId", clientId);
          console.log("¡Creaste cliente!");
        });
      } catch (error) {
        console.error(error);
      }
    } else if (clientOption === "existing") {
      console.log("elseif", data.clientId);
    }
    console.log("clientId2", clientId);
  };

  return (
    <>
      <div className="flex gap-8 p-4">
        <h1 className="text-2xl font-bold">
          Presupuestar el mueble: {singleFurniture.name}
        </h1>
        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
        >
          Volver al Inicio
        </Link>
        <Link
          to="/ver-muebles"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
        >
          Ver Muebles
        </Link>
      </div>

      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Datos del Mueble</h2>
        <div className="flex gap-4">
          <p className="mb-1">
            <span className="font-bold">Alto:</span> {singleFurniture.height}
          </p>
          <p className="mb-1">
            <span className="font-bold">Largo:</span> {singleFurniture.length}
          </p>
          <p className="mb-1">
            <span className="font-bold">Profundidad:</span>{" "}
            {singleFurniture.width}
          </p>
          <p className="mb-1">
            <span className="font-bold">Categoría:</span>{" "}
            {singleFurniture.category}
          </p>
        </div>
        <div className="flex gap-16">
          <div className="w-1/3">
            <h2 className="text-2xl font-semibold mb-2">Acabados del Mueble</h2>
            <p className="mb-1">
              <span className="font-bold">Enchapado (lustrado) en m2:</span>{" "}
              {totalVeneerPolished / 100} m<sup>2</sup>
            </p>
            <p className="mb-1">
              <span className="font-bold">Enchapado (laqueado) en m2:</span>{" "}
              {totalVeneerLacquered / 100} m<sup>2</sup>
            </p>
            <p className="mb-1">
              <span className="font-bold">Laqueado en m2:</span>{" "}
              {totalLacquered / 100} m<sup>2</sup>
            </p>
            <p className="mb-1">
              <span className="font-bold">Pantografiado en m2:</span>{" "}
              {totalPantographed / 100} m<sup>2</sup>
            </p>
            <p className="mb-1">
              <span className="font-bold">Filo total (laqueado):</span>{" "}
              {(totalLacqueredEdgeLength / 100).toFixed(2)} m
            </p>
            <p className="mb-1">
              <span className="font-bold">Filo total (sin laquear):</span>{" "}
              {(totalEdgeLength / 100).toFixed(2)} m
            </p>
          </div>

          <div className="w-2/3">
            <h2 className="text-2xl font-semibold mb-2">
              Insumos totales del mueble
            </h2>
            <div className="flex flex-wrap -mx-2">
              {sortedModules &&
                sortedModules.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4"
                  >
                    <div className=" p-4 rounded shadow">
                      <h4>{module.name}</h4>
                      {module.supplies_module.map((supply, supplyIndex) => (
                        <div key={supplyIndex} className="mb-2">
                          <p>
                            <span className="font-bold">Nombre:</span>{" "}
                            {supply.supplie_name}
                          </p>
                          <p>
                            <span className="font-bold">Cantidad:</span>{" "}
                            {supply.supplie_qty}
                          </p>
                          <p>
                            <span className="font-bold">Largo:</span>{" "}
                            {supply.supplie_length}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* cargar cantidad de placas a usar */}
      <div className="p-4 bg-gray-300 rounded-md shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-md font-semibold">Cantidad de materiales</p>{" "}
          <div className="flex gap-4">
            <button
              className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
              onClick={counterMaterial}
            >
              +
            </button>
            <button
              className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
              onClick={counterMaterial}
            >
              -
            </button>
            <p>Count: {countMaterial}</p>
          </div>
        </div>
        <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            {[...Array(countMaterial)].map((_, index) => (
              <div key={`containerMaterial${index}`}>
                <div className="flex w-1/2 my-2 gap-4">
                  <label htmlFor={`materialTable${index}`}>
                    Seleccionar material
                  </label>
                  <select
                    name={`materialTable${index}`}
                    id={`materialTable${index}`}
                    className="border-solid border-2 border-opacity mb-2 rounded-md"
                    {...register(`materialTable${index}`, {
                      required: "El campo es obligatorio",
                    })}
                  >
                    <option value="">Elegir una opción</option>
                    {tables.map((table) => (
                      <option key={table._id} value={table.name}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                  {errors[`materialTable${index}`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`materialTable${index}`].message}
                    </span>
                  )}
                  <label htmlFor={`tablesQty${index}`}>
                    Cantidad de placas
                  </label>
                  <input
                    name={`tablesQty${index}`}
                    type="number"
                    className="border-solid border-2 border-opacity mb-2 rounded-md w-16"
                    {...register(`tablesQty${index}`, {
                      required: "El campo es obligatorio",
                    })}
                  />
                  {errors[`tablesQty${index}`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`tablesQty${index}`].message}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-col w-1/4 my-2">
              <label>¿Cargar cliente o elegir uno existente?</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="newClient"
                  value="new"
                  {...register("clientOption", {
                    required: "Este campo es obligatorio",
                  })}
                  onChange={handleClientOption}
                />
                <label htmlFor="newClient" className="ml-2">
                  Cargar cliente
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="existingClient"
                  value="existing"
                  {...register("clientOption", {
                    required: "Este campo es obligatorio",
                  })}
                  onChange={handleClientOption}
                />
                <label htmlFor="existingClient" className="ml-2">
                  Elegir uno existente
                </label>
              </div>
              {errors.clientOption && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left">
                  {errors.clientOption.message}
                </span>
              )}
            </div>

            {clientOption === "new" ? (
              <FormCreateClient
                register={register}
                errors={errors}
              ></FormCreateClient>
            ) : clientOption === "existing" ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre"
                    {...register("clientNameInput")}
                    onChange={handleSearchTermChange}
                    className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
                  />
                  {filteredClients.length > 0 && (
                    <ul className="absolute border bg-white w-full max-h-40 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <li
                          key={client._id}
                          onClick={() => handleClientSelect(client)}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {client.lastname} {client.name} - DNI: {client.dni}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.clientId && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left">
                      {errors.clientId.message}
                    </span>
                  )}
                  <input
                    type="hidden"
                    {...register("clientId", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                </div>
              </>
            ) : (
              ""
            )}
            <button className="text-white bg-lightblue rounded-md px-2 py-1 mb-2 w-1/6 m-auto">
              Generar presupuesto
            </button>
          </div>
        </form>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-2">Despiece por módulo</h2>
        {sortedModules?.map((module) => (
          <div
            key={module._id}
            className="mb-8 p-4 bg-white rounded-md shadow-md"
          >
            <h3 className="text-xl font-bold mb-2">{module.name}</h3>
            {/* container datos  modulo e insumos */}
            <div className="flex gap-28">
              <div>
                <h4 className="text-xl font-semibold">Descripción módulo:</h4>
                <p className="mb-1">
                  <span className="font-bold">Categoría:</span>{" "}
                  {module.category}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Alto:</span> {module.height}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Largo:</span> {module.length}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Profundidad:</span> {module.width}
                </p>
                <p className="mb-1">
                  <span className="font-bold">Cantidad de piezas:</span>{" "}
                  {module.pieces_number}
                </p>
              </div>
              <div className="">
                <h4 className="text-xl font-semibold">Insumos módulo:</h4>
                <div className="flex flex-wrap">
                  {module.supplies_module.map((supply, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        <span className="font-bold">Nombre:</span>{" "}
                        {supply.supplie_name}
                      </p>
                      <p>
                        <span className="font-bold">Cantidad:</span>{" "}
                        {supply.supplie_qty}
                      </p>
                      <p>
                        <span className="font-bold">Largo:</span>{" "}
                        {supply.supplie_length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Piezas:</h4>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Nombre</th>
                    <th className="px-4 py-2 border-b">Material</th>
                    <th className="px-4 py-2 border-b">Categoría</th>
                    <th className="px-4 py-2 border-b">Alto</th>
                    <th className="px-4 py-2 border-b">Largo</th>
                    <th className="px-4 py-2 border-b">Orientación</th>
                    <th className="px-4 py-2 border-b">Acabado</th>
                    <th className="px-4 py-2 border-b">Filo Alto</th>
                    <th className="px-4 py-2 border-b">Filo Largo</th>
                    <th className="px-4 py-2 border-b">Filo Laqueado</th>
                  </tr>
                </thead>
                <tbody>
                  {module.pieces
                    .sort((a, b) => a.material.localeCompare(b.material))
                    .map((piece, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 border-b">{piece.name}</td>
                        <td className="px-4 py-2 border-b">{piece.material}</td>
                        <td className="px-4 py-2 border-b">{piece.category}</td>
                        <td className="px-4 py-2 border-b">{piece.length}</td>
                        <td className="px-4 py-2 border-b">{piece.width}</td>
                        <td className="px-4 py-2 border-b">
                          {piece.orientation === "cross-vertical"
                            ? "Transversal Vertical"
                            : piece.orientation === "cross-horizontal"
                            ? "Transversal Horizontal"
                            : piece.orientation === "side"
                            ? "Lateral"
                            : ""}
                        </td>
                        <td className="px-4 py-2 border-b">
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
                                ? "(Laqueado)"
                                : piece.veneerFinishing &&
                                  piece.veneerFinishing === "veneerPolished"
                                ? "(Lustrado)"
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
                        </td>

                        <td className="px-4 py-2 border-b">
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
                        <td className="px-4 py-2 border-b">
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
                        <td className="px-4 py-2 border-b">
                          {piece.lacqueredEdge ? "Sí" : "No"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export { CreateBudget };
