import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getFurnitureById,
  getAllTables,
  getAllEdgesSupplies,
  getAllVeneerSupplies,
  FormCreateClient,
  createClient,
  getAllClients,
  getAllServices,
  getAllSuppliesExceptTables,
} from "../../index.js";

function CreateBudget() {
  const { idFurniture } = useParams();
  const [singleFurniture, setSingleFurniture] = useState(null);
  const [countMaterial, setCountMaterial] = useState(0);
  const [countItemExtra, setCountItemExtra] = useState(0);
  const [tables, setTables] = useState([]);
  const [edges, setEdges] = useState([]);
  const [veneer, setVeneer] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [clientOption, setClientOption] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [services, setServices] = useState([]);
  const [materialEdge, setMaterialEdge] = useState(1);
  const [materialEdgeLaquered, setMaterialEdgeLaquered] = useState(0);
  const [chapa, setChapa] = useState(0);

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
        // console.log(furnituresData.data);
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

  // TRAER FILOS: para select de filos
  const getAllEdgesToSet = () => {
    getAllEdgesSupplies()
      .then((edgesData) => {
        setEdges(edgesData.data);
        // console.log(tablesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  // TRAER CHAPAS: para select de chapas
  const getAllVeneerToSet = () => {
    getAllVeneerSupplies()
      .then((veneerData) => {
        setVeneer(veneerData.data);
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

  // TRAER SERVICIOS: para multiplicar
  const getAllServicesToSet = () => {
    getAllServices()
      .then((servicesData) => {
        setServices(servicesData.data);
        // console.log(tablesData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };

  // TRAER INSUMOS: para tener el precio y multiplicar
  const getAllSuppliesToSet = () => {
    getAllSuppliesExceptTables()
      .then((supplieData) => {
        setSupplies(supplieData.data);
        // console.log(supplieData.data);
      })
      .catch((error) => {
        console.error("Este es el error:", error);
      });
  };
  //Servicios: obetener valores
  const enchapadoService = services.find(
    (service) => service.name === "Enchapado"
  );

  const laqueadoService = services.find(
    (service) => service.name === "Laqueado"
  );

  const lustreService = services.find((service) => service.name === "Lustre");

  const pantografiadoService = services.find(
    (service) => service.name === "Pantografiado"
  );

  const filoService = services.find(
    (service) => service.name === "Pegado de filo"
  );
  useEffect(() => {
    getFurnituresToSet();
    getAllTablesToSet();
    getAllEdgesToSet();
    getAllVeneerToSet();
    getAllSuppliesToSet();
    getAllServicesToSet();
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
    let totalVeneer = 0;
    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.veneer) {
          totalVeneer += piece.length * piece.width * 1.2; //se suma el enchapado total
          if (piece.veneerFinishing === "veneerLacquered") {
            // console.log(piece);
            totalVeneerLacquered += piece.length * piece.width * 1.2;
          }
          if (piece.veneerFinishing === "veneerPolished") {
            totalVeneerPolished += piece.length * piece.width * 1.2;
          }
        }
      });
    });

    return {
      totalVeneer,
      totalVeneerPolished,
      totalVeneerLacquered,
    };
  };
  const { totalVeneer, totalVeneerPolished, totalVeneerLacquered } =
    calculateTotalVeneer(singleFurniture.modules_furniture);

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

  //CÁLCULO DE TOTAL PIEZAS MELAMINA EN METROS CUADRADOS
  const calculateTotalMelamine = (modules) => {
    let totalMelamine = 0;
    let totalMelamineLacquered = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.melamine) {
          if (piece.melamineLacquered) {
            totalMelamineLacquered += piece.length * piece.width;
          } else {
            totalMelamine += piece.length * piece.width * 2;
          }
        }
      });
    });

    return {
      totalMelamine,
      totalMelamineLacquered,
    };
  };
  const { totalMelamine, totalMelamineLacquered } = calculateTotalMelamine(
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

  //sumar total de laqueado
  let totalLacqueredAll =
    totalLacquered + totalMelamineLacquered + totalVeneerLacquered;

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

  //CANTIDAD ITEMS EXTRA
  function counterItemExtra(e) {
    const action = e.target.innerText;
    let count;
    if (action === "+") {
      count = countItemExtra + 1;
    } else if (action === "-" && countItemExtra > 0) {
      count = countItemExtra - 1;
    } else {
      count = 0;
    }
    setCountItemExtra(count);
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

  //AL SELECCIONAR EL FILO OBTENER EL VALOR
  //filo común
  const handleMaterialEdgeOption = (event) => {
    let option = event.target.value;
    // console.log(option);
    const selectedEdge = edges.find((edge) => edge._id === option);

    if (selectedEdge) {
      setMaterialEdge(selectedEdge.price);
    } else {
      setMaterialEdge(1);
    }
  };

  //filo laqueado
  const handleMaterialEdgeLaqueredOption = (event) => {
    let option = event.target.value;
    // console.log(option);
    const selectedTable = tables.find((table) => table._id === option);

    if (selectedTable) {
      setMaterialEdgeLaquered(selectedTable.thickness);
    } else {
      setMaterialEdgeLaquered(0);
    }
  };

  //AL SELECCIONAR LA CHAPA OBTENER EL VALOR
  const handleChapaOption = (event) => {
    let option = event.target.value;
    // console.log(option);
    const selectedVeneer = veneer.find((veneer) => veneer._id === option);
    let veneerPrice = selectedVeneer.price * (totalVeneer / 100);
    setValue("veneer_price", veneerPrice);
    setChapa(veneerPrice.toLocaleString("es-ES"));
  };

  //OBTENER EL PRECIO DE LOS INSUMOS
  const getSupplyPrice = (supplyName) => {
    const supply = supplies.find((s) => s._id === supplyName);
    return supply ? supply.price : 0;
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
      <div className="p-4">
        <div className="flex gap-8 px-4 pb-4">
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
              <h2 className="text-2xl font-semibold mb-2">
                Acabados del Mueble
              </h2>
              <p className="mb-1">
                <span className="font-bold">Enchapado en m2:</span>{" "}
                {totalVeneer / 100} m<sup>2</sup> Precio: $
                {(enchapadoService?.price * (totalVeneer / 100)).toLocaleString(
                  "es-ES"
                )}
              </p>
              <p className="mb-1">
                <span className="font-bold">Lustrado en m2:</span>{" "}
                {totalVeneerPolished / 100} m<sup>2</sup> Precio: $
                {(
                  lustreService?.price *
                  (totalVeneerPolished / 100)
                ).toLocaleString("es-ES")}
              </p>

              <p className="mb-1">
                <span className="font-bold">Laqueado en m2:</span>{" "}
                {totalLacqueredAll / 100} m<sup>2</sup> Precio: $
                {(
                  laqueadoService?.price *
                  (totalLacqueredAll / 100)
                ).toLocaleString("es-ES")}
              </p>
              <p className="mb-1">
                <span className="font-bold">Pantografiado en m2:</span>{" "}
                {totalPantographed / 100} m<sup>2</sup> Precio: $
                {(
                  pantografiadoService?.price *
                  (totalPantographed / 100)
                ).toLocaleString("es-ES")}
              </p>
              {/* FILO */}
              <div className="flex gap-y-4">
                <p className="font-bold">Filo total (laqueado):</p>
                <div className="flex flex-col w-1/3  ">
                  {materialEdgeLaquered > 0 ? (
                    <p className="mb-1">
                      {(
                        (totalLacqueredEdgeLength * materialEdgeLaquered) /
                        100
                      ).toFixed(2)}{" "}
                      m<sup>2</sup> Precio: $
                      {(
                        laqueadoService?.price *
                        (
                          (totalLacqueredEdgeLength * materialEdgeLaquered) /
                          100
                        ).toFixed(2)
                      ).toLocaleString("es-ES")}
                    </p>
                  ) : (
                    <p className="text-red-500">Elegir una placa</p>
                  )}
                </div>
                <div className="flex flex-col w-1/3  ">
                  <select
                    name={`edgeLaqueredSelect`}
                    id={`edgeLaqueredSelect`}
                    className="border-solid border-2 border-opacity mb-2 rounded-md"
                    {...register(`edgeLaqueredSelect`, {
                      required: "El campo es obligatorio",
                    })}
                    onChange={handleMaterialEdgeLaqueredOption}
                  >
                    <option value="">Elegir una opción</option>
                    {tables.map((table) => (
                      <option key={table._id} value={table._id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                  {errors[`edgeLaqueredSelect`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`edgeLaqueredSelect`].message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <p className="mb-1">
                  <span className="font-bold">Filo total (sin laquear):</span>{" "}
                  {(totalEdgeLength / 100).toFixed(2)} m Precio: $
                  {(
                    filoService?.price *
                    (totalLacqueredEdgeLength / 100) *
                    materialEdge
                  ).toLocaleString("es-ES")}
                </p>
                <div className="flex flex-col w-1/2 ">
                  <select
                    name={`edgeSelect`}
                    id={`edgeSelect`}
                    className="border-solid border-2 border-opacity mb-2 rounded-md"
                    {...register(`edgeSelect`, {
                      required: "El campo es obligatorio",
                    })}
                    onChange={handleMaterialEdgeOption}
                  >
                    <option value="">Elegir una opción</option>
                    {edges.map((edge) => (
                      <option key={edge._id} value={edge._id}>
                        {edge.name}
                      </option>
                    ))}
                  </select>
                  {errors[`edgeSelect`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`edgeSelect`].message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* INSUMOS */}
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
                            <p>
                              <span className="font-bold">Precio total:</span> $
                              {getSupplyPrice(supply.supplie_id) *
                                supply.supplie_qty *
                                (supply.supplie_name === "Barral"
                                  ? supply.supplie_length
                                  : 1)}
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
              {/* item extra inicio */}

              <div className="flex items-center gap-2 pt-4">
                <p className="text-md font-semibold">Items extra</p>{" "}
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                    onClick={counterItemExtra}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                    onClick={counterItemExtra}
                  >
                    -
                  </button>
                  <p>Count: {countItemExtra}</p>
                </div>
              </div>
              {[...Array(countItemExtra)].map((_, index) => (
                <div
                  key={`containerItemExtra${index}`}
                  className="flex w-1/2 gap-4"
                >
                  <div className="flex flex-col">
                    <label htmlFor={`itemExtra${index}`}>Nombre</label>
                    <input
                      name={`itemExtra${index}`}
                      type="text"
                      className="border-solid border-2 border-opacity mb-2 rounded-md "
                      {...register(`itemExtra${index}`, {
                        required: "El campo es obligatorio",
                      })}
                    />
                    {errors[`itemExtra${index}`] && (
                      <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                        {errors[`itemExtra${index}`].message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor={`itemExtraPrice${index}`}>Precio</label>
                    <input
                      name={`itemExtraPrice${index}`}
                      type="text"
                      className="border-solid border-2 border-opacity mb-2 rounded-md "
                      {...register(`itemExtraPrice${index}`, {
                        required: "El campo es obligatorio",
                      })}
                    />
                    {errors[`itemExtraPrice${index}`] && (
                      <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                        {errors[`itemExtraPrice${index}`].message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* item extra fin */}
              {/* chapa enchapado */}
              {totalVeneer > 0 ? (
                <>
                  <h3 className="pt-4 font-semibold">Chapa</h3>
                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/4  ">
                      {" "}
                      <label htmlFor={`veneerSelect`}>Elegir chapa</label>
                      <select
                        name={`veneerSelect`}
                        id={`veneerSelect`}
                        className="border-solid border-2 border-opacity mb-2 rounded-md"
                        {...register(`veneerSelect`, {
                          required: "El campo es obligatorio",
                        })}
                        onChange={handleChapaOption}
                      >
                        <option value="">Elegir una opción</option>
                        {veneer.map((veneer) => (
                          <option key={veneer._id} value={veneer._id}>
                            {veneer.name}
                          </option>
                        ))}
                      </select>
                      {errors[`veneerSelect`] && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                          {errors[`veneerSelect`].message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col w-1/4  ">
                      {" "}
                      <label htmlFor={`veneer_price`}>Precio chapa</label>
                      <p>$ {chapa}</p>
                      <input
                        name={`veneer_price`}
                        type="hidden"
                        readOnly
                        className="border-solid border-2 border-opacity mb-2 rounded-md "
                        {...register(`veneer_price`, {
                          required: "El campo es obligatorio",
                        })}
                      />
                      {errors[`veneer_price`] && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                          {errors[`veneer_price`].message}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* chapa enchapado fin*/}
              {/* item ajuste */}
              <h3 className="pt-4 font-semibold">Ítem de ajuste</h3>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/4  ">
                  {" "}
                  <label htmlFor={`adjustment_reason`}>Razón de ajuste</label>
                  <input
                    name={`adjustment_reason`}
                    type="text"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`adjustment_reason`, {
                      required: "El campo es obligatorio",
                    })}
                  />
                  {errors[`adjustment_reason`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`adjustment_reason`].message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-1/4  ">
                  {" "}
                  <label htmlFor={`adjustment_price`}>Valor del ajuste</label>
                  <input
                    name={`adjustment_price`}
                    type="number"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`adjustment_price`, {
                      required: "El campo es obligatorio",
                    })}
                  />
                  {errors[`adjustment_price`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`adjustment_price`].message}
                    </span>
                  )}
                </div>
              </div>
              {/* item ajuste fin*/}
              {/* carga cliente*/}
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
                    <span className="font-bold">Profundidad:</span>{" "}
                    {module.width}
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
                          <td className="px-4 py-2 border-b">
                            {piece.material}
                          </td>
                          <td className="px-4 py-2 border-b">
                            {piece.category}
                          </td>
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
      </div>
    </>
  );
}

export { CreateBudget };
