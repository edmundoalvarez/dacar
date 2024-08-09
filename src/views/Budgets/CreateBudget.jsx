import { useEffect, useState } from "react";
import { Await, Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getFurnitureById,
  getAllTables,
  getAllEdgesSupplies,
  getAllVeneerSupplies,
  FormCreateClient,
  getAllClients,
  getAllServices,
  getAllSuppliesExceptTables,
  createClient,
  getClientById,
  createBudget,
  getLastBudgetNum,
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

  const navigate = useNavigate();

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
    setValue("chapa_price", veneerPrice);
    setChapa(veneerPrice.toLocaleString("es-ES"));
  };

  //AL SELECCIONAR LA PLACA OBTENER EL VALOR
  const handleMaterialOption = (index) => (event) => {
    let option = event.target.value;
    const selectedTable = tables.find((table) => table.name === option);
    setValue(`materialPrice${index}`, selectedTable.price);
  };

  //OBTENER EL PRECIO DE LOS INSUMOS
  const getSupplyPrice = (
    supplyId,
    supplyQty,
    supplyName,
    supplyLength,
    suppliePrice
  ) => {
    const supply = supplies.find((s) => s._id === supplyId);
    setValue(
      suppliePrice,
      supply
        ? supply.price *
            supplyQty *
            (supplyName === "Barral" ? supplyLength : 1)
        : 0
    );
    return supply
      ? supply.price * supplyQty * (supplyName === "Barral" ? supplyLength : 1)
      : 0;
  };

  // obtener el valor de corte de placa
  function getServicePriceById(id, servicesArray) {
    const service = servicesArray.find((service) => service._id === id);
    return service ? service.price : null;
  }

  const cortePlacaId = "66a5baf9218ee6221506c11c";
  const cortePlacaPrice = getServicePriceById(cortePlacaId, services);

  //FORMULARIO GENERAR PRESUPUESTO
  const onSubmit = async (data, event) => {
    event.preventDefault();
    // console.log("data formulario", data);
    //Budget Number

    // Creación del objeto supplies agrupado por módulos
    const supplies = {};
    let totalSuppliesPrice = 0; // Inicializa la variable totalSuppliesPrice

    Object.keys(data).forEach((key) => {
      const match = key.match(/(supplie\w+)(\d+)-(\d+)/);
      if (match) {
        const [_, prefix, moduleIndex, supplyIndex] = match;
        const moduleKey = `moduleName${moduleIndex}`;

        if (!supplies[moduleKey]) {
          supplies[moduleKey] = {
            moduleName: data[moduleKey],
            supplies: [],
          };
        }

        const supply = supplies[moduleKey].supplies[supplyIndex] || {};

        if (prefix === "supplieName") supply.name = data[key];
        if (prefix === "suppliePrice") {
          const price = Number(data[key]); // Convierte a número
          supply.price = price;

          // Si ya existen qty y length (si es "Barral"), calcula el precio total
          if (supply.qty !== undefined) {
            if (supply.name === "Barral" && supply.length !== undefined) {
              totalSuppliesPrice += price * supply.qty * Number(supply.length);
            } else {
              totalSuppliesPrice += price * supply.qty;
            }
          }
        }
        if (prefix === "supplieLength") {
          const length = Number(data[key]); // Convierte a número
          supply.length = length;

          // Si ya existen price y qty, calcula el precio total para "Barral"
          if (
            supply.name === "Barral" &&
            supply.price !== undefined &&
            supply.qty !== undefined
          ) {
            totalSuppliesPrice += supply.price * supply.qty * length;
          }
        }
        if (prefix === "supplieQty") {
          const qty = Number(data[key]); // Convierte a número
          supply.qty = qty;

          // Si ya existen price y length (si es "Barral"), calcula el precio total
          if (supply.price !== undefined) {
            if (supply.name === "Barral" && supply.length !== undefined) {
              totalSuppliesPrice += supply.price * qty * Number(supply.length);
            } else {
              totalSuppliesPrice += supply.price * qty;
            }
          }
        }

        supplies[moduleKey].supplies[supplyIndex] = supply;
      }
    });

    // Transformar el objeto supplies en una lista
    const suppliesList = Object.values(supplies);

    // Carga cliente
    let clientData;
    // Código para crear o seleccionar cliente (comentado para ejemplo)
    if (clientOption === "new") {
      try {
        await createClient({
          ...data,
        }).then((res) => {
          clientId = res.data._id;
          clientData = res.data;
          console.log("¡Creaste cliente!");
        });
      } catch (error) {
        console.error(error);
      }
    } else if (clientOption === "existing") {
      try {
        await getClientById(data.clientId).then((res) => {
          clientData = res.data;
        });
      } catch (error) {
        console.error(error);
      }
    }

    // Creación del objeto materials
    const materials = {};
    let totalMaterialPrice = 0; // Inicializa la variable totalMaterialPrice
    let totalMaterialQty = 0; // Inicializa la variable totalMaterialQty

    Object.keys(data).forEach((key) => {
      const match = key.match(/(material\w+)(\d+)/);
      if (match) {
        const [_, prefix, index] = match;
        const materialKey = `material${index}`;

        if (!materials[materialKey]) {
          materials[materialKey] = {};
        }

        if (prefix === "materialPrice") {
          const price = Number(data[key]); // Convierte a número
          materials[materialKey].price = price;

          // Si ya existe qty, calcula el precio total para este material
          if (materials[materialKey].qty !== undefined) {
            totalMaterialPrice += price * materials[materialKey].qty;
          }
        }

        if (prefix === "materialQty") {
          const qty = Number(data[key]); // Convierte a número
          materials[materialKey].qty = qty;

          // Suma el qty al totalMaterialQty
          totalMaterialQty += qty;

          // Si ya existe price, calcula el precio total para este material
          if (materials[materialKey].price !== undefined) {
            totalMaterialPrice += qty * materials[materialKey].price;
          }
        }

        if (prefix === "materialTable") {
          materials[materialKey].table = data[key];
        }
      }
    });
    // Transformar el objeto materials en una lista (opcional)
    const materialsList = Object.values(materials);

    // Creación del objeto extra_items
    const extraItems = {};
    let extraItemPrice = 0; // Inicializa la variable extraItemPrice

    Object.keys(data).forEach((key) => {
      const match = key.match(/(itemExtra\w*)(\d+)/);
      if (match) {
        const [_, prefix, index] = match;
        const itemExtraKey = `itemExtra${index}`;

        if (!extraItems[itemExtraKey]) {
          extraItems[itemExtraKey] = {};
        }

        if (prefix === "itemExtra") {
          extraItems[itemExtraKey].name = data[key];
        }

        if (prefix === "itemExtraPrice") {
          const price = Number(data[key]); // Convierte a número
          extraItems[itemExtraKey].price = price;
          extraItemPrice += price; // Suma el precio a extraItemPrice
        }
      }
    });

    // Transformar el objeto extraItems en una lista (opcional)
    const extraItemsList = Object.values(extraItems);

    //obtetener el ultimo budget_number
    let lastnumber;
    try {
      lastnumber = await getLastBudgetNum();
    } catch (error) {
      console.error("Error ", error);
    }

    //sumar precio final
    let total_price =
      data.chapa_price * 3.8 +
      data.edgeLaqueredPrice +
      data.edgePrice * 3.8 +
      data.lacqueredPrice +
      totalMaterialPrice * 3.8 +
      totalSuppliesPrice * 3.8 +
      data.pantographedPrice +
      data.veneerPolishedPrice +
      data.veneerPrice * 3.8 +
      cortePlacaPrice * totalMaterialQty +
      Number(data.placementPrice) +
      Number(data.shipmentPrice) +
      extraItemPrice -
      Number(data.adjustment_price);

    // Objeto final para crear el presupuesto
    const budgetData = {
      budget_number: lastnumber + 1,
      furniture_name: data.furniture_name,
      length: data.length,
      width: data.width,
      height: data.height,
      category: data.category,
      furniture: singleFurniture,
      veneer: {
        veneerM2: data.veneerM2,
        veneerPrice: data.veneerPrice,
      },
      veneerPolished: {
        veneerPolishedM2: data.veneerPolishedM2,
        veneerPolishedPrice: data.veneerPolishedPrice,
      },
      chapa: {
        veneerSelect: data.veneerSelect,
        chapa_price: data.chapa_price,
      },
      lacquered: {
        lacqueredM2: data.lacqueredM2,
        lacqueredPrice: data.lacqueredPrice,
      },
      pantographed: {
        pantographedM2: data.pantographedM2,
        pantographedPrice: data.pantographedPrice,
      },
      edge_lacquered: {
        edgeLaqueredSelect: data.edgeLaqueredSelect,
        edgeLaqueredM2: data.edgeLaqueredM2,
        edgeLaqueredPrice: data.edgeLaqueredPrice,
      },
      edge_no_lacquered: {
        edgeSelect: data.edgeSelect,
        edgeM2: data.edgeM2,
        edgePrice: data.edgePrice,
      },
      supplies: suppliesList,
      material: materialsList,
      extra_items: extraItemsList,
      adjustment_reason: data.adjustment_reason,
      adjustment_price: data.adjustment_price,
      total_price: total_price,
      deliver_date: data.deliver_date,
      comments: data.comments,
      client: clientData,
      placement: data.placement,
      placement_price: data.placementPrice,
      shipment: data.shipment,
      shipmentt_price: data.shipmentPrice,
      show_modules: data.showModules,
    };

    // //TODO AGREGAR USERNAME
    console.log(budgetData);

    try {
      await createBudget(budgetData);
      console.log("Presupuesto creado", budgetData);
      navigate("/ver-presupuestos");
    } catch (error) {
      console.error("Error creando presupuesto:", error);
    }
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
        <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
          <input
            name={`furniture_name`}
            type="hidden"
            value={singleFurniture.name}
            {...register(`furniture_name`)}
          />
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Datos del Mueble</h2>
            <div className="flex gap-4">
              <p className="mb-1">
                <span className="font-bold">Alto:</span>{" "}
                {singleFurniture.height}
              </p>
              <input
                name={`height`}
                type="hidden"
                value={singleFurniture.height}
                {...register(`height`)}
              />
              <p className="mb-1">
                <span className="font-bold">Largo:</span>{" "}
                {singleFurniture.length}
              </p>
              <input
                name={`length`}
                type="hidden"
                value={singleFurniture.length}
                {...register(`length`)}
              />
              <p className="mb-1">
                <span className="font-bold">Profundidad:</span>{" "}
                {singleFurniture.width}
              </p>
              <input
                name={`width`}
                type="hidden"
                value={singleFurniture.width}
                {...register(`width`)}
              />
              <p className="mb-1">
                <span className="font-bold">Categoría:</span>{" "}
                {singleFurniture.category}
              </p>{" "}
              <input
                name={`category`}
                type="hidden"
                value={singleFurniture.category}
                {...register(`category`)}
              />
            </div>
            <div className="flex gap-16">
              <div className="w-1/3">
                <h2 className="text-2xl font-semibold mb-2">
                  Acabados del Mueble
                </h2>
                {/* ENCHAPADO */}
                <p className="mb-1">
                  <span className="font-bold">Enchapado en m2:</span>{" "}
                  {totalVeneer / 100} m<sup>2</sup> Precio: $
                  {(
                    enchapadoService?.price *
                    (totalVeneer / 100)
                  ).toLocaleString("es-ES")}
                  {setValue(
                    "veneerPrice",
                    enchapadoService?.price * (totalVeneer / 100)
                  )}
                </p>
                <input
                  name={`veneerM2`}
                  type="hidden"
                  value={totalVeneer / 100}
                  {...register(`veneerM2`)}
                />
                <input
                  name={`veneerPrice`}
                  type="hidden"
                  value={enchapadoService?.price * (totalVeneer / 100)}
                  {...register(`veneerPrice`)}
                />
                {/* LUSTRADO */}
                <p className="mb-1">
                  <span className="font-bold">Lustrado en m2:</span>{" "}
                  {totalVeneerPolished / 100} m<sup>2</sup> Precio: $
                  {(
                    lustreService?.price *
                    (totalVeneerPolished / 100)
                  ).toLocaleString("es-ES")}
                  {setValue(
                    "veneerPolishedPrice",
                    lustreService?.price * (totalVeneerPolished / 100)
                  )}
                </p>
                <input
                  name={`veneerPolishedM2`}
                  type="hidden"
                  value={totalVeneerPolished / 100}
                  {...register(`veneerPolishedM2`)}
                />
                <input
                  name={`veneerPolishedPrice`}
                  type="hidden"
                  value={lustreService?.price * (totalVeneerPolished / 100)}
                  {...register(`veneerPolishedPrice`)}
                />
                {/* LAQUEADO */}
                <p className="mb-1">
                  <span className="font-bold">Laqueado en m2:</span>{" "}
                  {totalLacqueredAll / 100} m<sup>2</sup> Precio: $
                  {(
                    laqueadoService?.price *
                    (totalLacqueredAll / 100)
                  ).toLocaleString("es-ES")}
                  {setValue(
                    "lacqueredPrice",
                    laqueadoService?.price * (totalLacqueredAll / 100)
                  )}
                </p>
                <input
                  name={`lacqueredM2`}
                  type="hidden"
                  value={totalLacqueredAll / 100}
                  {...register(`lacqueredM2`)}
                />
                <input
                  name={`lacqueredPrice`}
                  type="hidden"
                  {...register(`lacqueredPrice`)}
                  value={laqueadoService?.price * (totalLacqueredAll / 100)}
                />
                {/* PANTOGRAFIADO */}
                <p className="mb-1">
                  <span className="font-bold">Pantografiado en m2:</span>{" "}
                  {totalPantographed / 100} m<sup>2</sup> Precio: $
                  {(
                    pantografiadoService?.price *
                    (totalPantographed / 100)
                  ).toLocaleString("es-ES")}
                  {setValue(
                    "pantographedPrice",
                    pantografiadoService?.price * (totalPantographed / 100)
                  )}
                </p>
                <input
                  name={`pantographedM2`}
                  type="hidden"
                  value={totalPantographed / 100}
                  {...register(`pantographedM2`)}
                />
                <input
                  name={`pantographedPrice`}
                  type="hidden"
                  value={
                    pantografiadoService?.price * (totalPantographed / 100)
                  }
                  {...register(`pantographedPrice`)}
                />
                {/* FILO */}
                <div className="flex gap-y-4">
                  <p className="font-bold">Filo total (laqueado):</p>
                  <div className="flex flex-col w-1/3  ">
                    {materialEdgeLaquered > 0 ? (
                      <>
                        <p className="mb-1">
                          {(
                            (totalLacqueredEdgeLength * materialEdgeLaquered) /
                            100
                          ).toFixed(2)}{" "}
                          m<sup>2</sup> Precio: $
                          {(
                            laqueadoService?.price *
                            (
                              (totalLacqueredEdgeLength *
                                materialEdgeLaquered) /
                              100
                            ).toFixed(2)
                          ).toLocaleString("es-ES")}
                          {setValue(
                            "edgeLaqueredPrice",
                            laqueadoService?.price *
                              (
                                (totalLacqueredEdgeLength *
                                  materialEdgeLaquered) /
                                100
                              ).toFixed(2)
                          )}
                        </p>
                        <input
                          name={`edgeLaqueredM2`}
                          type="hidden"
                          value={(
                            (totalLacqueredEdgeLength * materialEdgeLaquered) /
                            100
                          ).toFixed(2)}
                          {...register(`edgeLaqueredM2`)}
                        />
                        <input
                          name={`edgeLaqueredPrice`}
                          type="hidden"
                          value={
                            laqueadoService?.price *
                            (
                              (totalLacqueredEdgeLength *
                                materialEdgeLaquered) /
                              100
                            ).toFixed(2)
                          }
                          {...register(`edgeLaqueredPrice`)}
                        />
                      </>
                    ) : (
                      <p className="text-red-500">Elegir una placa</p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/3  ">
                    <select
                      name={`edgeLaqueredSelect`}
                      id={`edgeLaqueredSelect`}
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                      {...register(`edgeLaqueredSelect`)}
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
                    {setValue(
                      "edgePrice",
                      filoService?.price *
                        (totalLacqueredEdgeLength / 100) *
                        materialEdge
                    )}
                  </p>
                  <input
                    name={`edgeM2`}
                    type="hidden"
                    value={(totalEdgeLength / 100).toFixed(2)}
                    {...register(`edgeM2`)}
                  />
                  <input
                    name={`edgePrice`}
                    type="hidden"
                    value={
                      filoService?.price *
                      (totalLacqueredEdgeLength / 100) *
                      materialEdge
                    }
                    {...register(`edgePrice`)}
                  />
                  <div className="flex flex-col w-1/2 ">
                    <select
                      name={`edgeSelect`}
                      id={`edgeSelect`}
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                      {...register(`edgeSelect`)}
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
                          <input
                            name={`moduleName${moduleIndex}`}
                            type="hidden"
                            value={module.name}
                            {...register(`moduleName${moduleIndex}`)}
                          />
                          {module.supplies_module.map((supply, supplyIndex) => (
                            <div key={`sup${supplyIndex}`} className="mb-2">
                              <p>
                                <span className="font-bold">Nombre:</span>{" "}
                                {supply.supplie_name}
                              </p>
                              <input
                                name={`supplieName${moduleIndex}-${supplyIndex}`}
                                type="hidden"
                                value={supply.supplie_name}
                                {...register(
                                  `supplieName${moduleIndex}-${supplyIndex}`
                                )}
                              />
                              <p>
                                <span className="font-bold">Cantidad:</span>{" "}
                                {supply.supplie_qty}
                              </p>
                              <input
                                name={`supplieQty${moduleIndex}-${supplyIndex}`}
                                type="hidden"
                                value={supply.supplie_qty}
                                {...register(
                                  `supplieQty${moduleIndex}-${supplyIndex}`
                                )}
                              />
                              <p>
                                <span className="font-bold">Largo:</span>{" "}
                                {supply.supplie_length}
                              </p>
                              <input
                                name={`supplieLength${moduleIndex}-${supplyIndex}`}
                                type="hidden"
                                value={supply.supplie_length}
                                {...register(
                                  `supplieLength${moduleIndex}-${supplyIndex}`
                                )}
                              />
                              <p>
                                <span className="font-bold">Precio total:</span>{" "}
                                $
                                {getSupplyPrice(
                                  supply.supplie_id,
                                  supply.supplie_qty,
                                  supply.supplie_name,
                                  supply.supplie_length,
                                  `suppliePrice${moduleIndex}-${supplyIndex}`
                                )}
                              </p>
                              <input
                                name={`suppliePrice${moduleIndex}-${supplyIndex}`}
                                type="hidden"
                                {...register(
                                  `suppliePrice${moduleIndex}-${supplyIndex}`
                                )}
                              />
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
              <p className="text-md font-semibold">Cantidad de placas</p>{" "}
              <div className="flex gap-4">
                <button
                  type="button"
                  className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-xl font-semibold bg-slate-100 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  -
                </button>
                <p>Count: {countMaterial}</p>
              </div>
            </div>

            <div className="flex flex-col">
              {[...Array(countMaterial)].map((_, index) => (
                <div key={`containerMaterial${index}`}>
                  <div className="flex w-1/2 my-2 gap-4">
                    <label htmlFor={`materialTable${index}`}>
                      Seleccionar placa
                    </label>
                    <select
                      name={`materialTable${index}`}
                      id={`materialTable${index}`}
                      className="border-solid border-2 border-opacity mb-2 rounded-md"
                      {...register(`materialTable${index}`)}
                      onChange={handleMaterialOption(index)}
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

                    <label htmlFor={`materialQty${index}`}>
                      Cantidad de placas
                    </label>
                    <input
                      name={`materialQty${index}`}
                      type="number"
                      className="border-solid border-2 border-opacity mb-2 rounded-md w-16"
                      {...register(`materialQty${index}`)}
                    />
                    {errors[`materialQty${index}`] && (
                      <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                        {errors[`materialQty${index}`].message}
                      </span>
                    )}
                    {/* placa price */}
                    <input
                      name={`materialPrice${index}`}
                      type="hidden"
                      {...register(`materialPrice${index}`)}
                    />
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
                      {...register(`itemExtra${index}`)}
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
                      {...register(`itemExtraPrice${index}`)}
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
                        {...register(`veneerSelect`)}
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
                      <label htmlFor={`chapa_price`}>Precio chapa</label>
                      <p>$ {chapa}</p>
                      <input
                        name={`chapa_price`}
                        type="hidden"
                        {...register(`chapa_price`)}
                      />
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
                    {...register(`adjustment_reason`)}
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
                    {...register(`adjustment_price`)}
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
                    {...register(`clientOption`, {
                      required: "El campo es obligatorio",
                    })}
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
                    {...register(`clientOption`, {
                      required: "El campo es obligatorio",
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
                    <input type="hidden" {...register("clientId")} />
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="flex gap-4">
                <div className="flex flex-col w-2/4  ">
                  {" "}
                  <label htmlFor={`comments`}>Comentarios</label>
                  <textarea
                    name={`comments`}
                    type="text"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`comments`)}
                  />
                  {errors[`comments`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`comments`].message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-1/4  ">
                  {" "}
                  <label htmlFor={`deliver_date`}>Fecha de entrega</label>
                  <input
                    name={`deliver_date`}
                    type="date"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`deliver_date`)}
                  />
                  {errors[`deliver_date`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`deliver_date`].message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex  w-1/2 my-4 gap-4">
                <label htmlFor="placement">Colocación</label>
                <select
                  name="placement"
                  id="placement"
                  className="border-solid border-2 border-opacity mb-2 rounded-md"
                  {...register("placement", {
                    required: "El campo es obligatorio",
                  })}
                >
                  <option value="">Elegir una opción</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
                {errors.placement && (
                  <span className="text-xs xl:text-base text-red-700 mt-2 block text-left">
                    {errors.placement.message}
                  </span>
                )}

                <>
                  <label htmlFor="placementPrice">Precio</label>
                  <input
                    name={`placementPrice`}
                    type="number"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`placementPrice`)}
                  />
                </>
              </div>
              <div className="flex  w-1/2 my-4 gap-4">
                <label htmlFor="shipment">Envío</label>
                <select
                  name="shipment"
                  id="shipment"
                  className="border-solid border-2 border-opacity mb-2 rounded-md"
                  {...register("shipment", {
                    required: "El campo es obligatorio",
                  })}
                >
                  <option value="">Elegir opción</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
                {errors.shipment && (
                  <span className="text-xs xl:text-base text-red-700 mt-2 block text-left">
                    {errors.shipment.message}
                  </span>
                )}
                <label htmlFor="shipmentPrice">Precio</label>
                <input
                  name={`shipmentPrice`}
                  type="number"
                  className="border-solid border-2 border-opacity mb-2 rounded-md "
                  {...register(`shipmentPrice`)}
                />
              </div>
              <div className="flex  w-1/2 my-4 gap-4">
                <label htmlFor="showModules">
                  Mostrar módulos en presupuesto
                </label>
                <input
                  type="checkbox"
                  name="showModules"
                  id="showModules"
                  {...register(`showModules`)}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-lightblue rounded-md px-2 py-1 mb-2 w-1/6 m-auto"
              >
                Generar presupuesto
              </button>
            </div>
          </div>
        </form>
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
