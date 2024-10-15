import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid } from "react-loader-spinner";
import {
  getBudgetById,
  getAllServices,
  getAllTables,
  getAllEdgesSupplies,
  getAllVeneerSupplies,
  FormCreateClient,
  getAllClients,
} from "../../index.js";

function EditBudget() {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [singleFurniture, setSingleFurniture] = useState(null);
  const [totalVeneer, setTotalVeneer] = useState(0);
  const [totalVeneerPolished, setTotalVeneerPolished] = useState(0);
  const [totalVeneerLacqueredOpen, setTotalVeneerLacqueredOpen] = useState(0);
  const [totalLacqueredAll, setTotalLacqueredAll] = useState(0);
  const [totalPantographed, setTotalPantographed] = useState(0);
  const [services, setServices] = useState([]);
  //Filos
  const [edges, setEdges] = useState([]);
  const [totalLacqueredEdgeLength, setTotalLacqueredEdgeLength] = useState(0);
  const [totalPolishedEdgeLength, setTotalPolishedEdgeLength] = useState(0);
  const [totalEdgeLength, setTotalEdgeLength] = useState(0);
  const [edgeSelect, setEdgeSelect] = useState("");
  //Grosores y material filos
  const [materialEdgeLaquered, setMaterialEdgeLaquered] = useState(0);
  const [materialEdgePolished, setMaterialEdgePolished] = useState(0);
  const [materialEdge, setMaterialEdge] = useState(1);
  //Insumos
  const [supplies, setSupplies] = useState([]);
  const [showSupplies, setShowSupplies] = useState(true);
  const [totalSuppliePrice, setTotalSuppliePrice] = useState(true);
  //Placas
  const [tables, setTables] = useState([]);
  const [countMaterial, setCountMaterial] = useState(0);
  const [totalMaterialPrice, setTotalMaterialPrice] = useState(0);
  //Items extra
  const [countItemExtra, setCountItemExtra] = useState(0);
  const [subTotalItemExtraPrice, setSubTotalItemExtraPrice] = useState(0);
  //Chapa
  const [chapa, setChapa] = useState(0);
  const [veneer, setVeneer] = useState([]);
  //Cliente
  const [clientOption, setClientOption] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  //Colocación
  const [subtotalPlacement, setSubtotalPlacement] = useState(0);
  //Envío
  const [subtotalShipmentPrice, setSubtotalShipmentPrice] = useState(0);
  //Total Price
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const getBudgetToSet = () => {
    getBudgetById(budgetId)
      .then((budgetData) => {
        console.log(budgetData.data);
        setBudget(budgetData.data);
        setSingleFurniture(budgetData.data.furniture[0]);
        setTotalVeneer(Number(budgetData.data.veneer[0].veneerM2));
        setTotalVeneerPolished(
          Number(budgetData.data.veneerPolished[0].veneerPolishedM2)
        );
        setTotalVeneerLacqueredOpen(
          Number(budgetData.data.lacqueredOpen[0].lacqueredOpenM2)
        );
        setTotalLacqueredAll(Number(budgetData.data.lacquered[0].lacqueredM2));
        setTotalPantographed(
          Number(budgetData.data.pantographed[0].pantographedM2)
        );
        //FILO LAQUEADO
        setValue(
          "edgeLaqueredM2",
          budgetData.data.edge_lacquered[0].edgeLaqueredM2
        );
        console.log(
          " budgetData.data.edge_lacquered[0].edgeLaqueredPrice",
          budgetData.data.edge_lacquered[0].edgeLaqueredPrice
        );
        setValue(
          "edgeLaqueredPrice",
          budgetData.data.edge_lacquered[0].edgeLaqueredPrice
        );
        setTotalLacqueredEdgeLength(
          Number(budgetData.data.edge_lacquered[0].totalLacqueredEdgeLength)
        );
        setValue(
          "edgeThickness",
          budgetData.data.edge_lacquered[0].edgeLaqueredThickness
        );

        setMaterialEdgeLaquered(
          budgetData.data.edge_lacquered[0].edgeLaqueredThickness
        );

        //FILO LUSTRADO
        setValue(
          "edgePolishedM2",
          budgetData.data.edge_polished[0].edgePolishedM2
        );

        setValue(
          "edgePolishedPrice",
          budgetData.data.edge_polished[0].edgePolishedPrice
        );

        setTotalPolishedEdgeLength(
          Number(budgetData.data.edge_polished[0].totalPolishedEdgeLength)
        );
        setValue(
          "edgePolishedThickness",
          budgetData.data.edge_polished[0].edgePolishedThickness
        );

        setMaterialEdgePolished(
          budgetData.data.edge_polished[0].edgePolishedThickness
        );

        //FILO SIN NADA
        setTotalEdgeLength(Number(budgetData.data.edge_no_lacquered[0].edgeM2));
        setValue("edgeSelect", budgetData.data.edge_no_lacquered[0].edgeSelect);
        setEdgeSelect(budgetData.data.edge_no_lacquered[0].edgeSelect);

        //INSUMOS
        if (budgetData.data.supplies) {
          if (budgetData.data.supplies.length > 0) {
            setShowSupplies(true);
            setSupplies(budgetData.data.supplies); // Actualizar el estado con los insumos

            const totalPrice = budgetData.data.supplies.reduce(
              (acc, supply) => {
                return acc + (supply.price || 0);
              },
              0
            );

            setTotalSuppliePrice(totalPrice);
          }
        }

        //PLACAS
        if (budgetData.data.materials) {
          if (budgetData.data.materials.length > 0) {
            // Iterar sobre los materiales para asignar los valores
            budgetData.data.materials.forEach((material, index) => {
              // Asignar el valor de materialTable
              setValue(`materialTable${index}`, material.table || "");

              // Asignar el valor de materialQty
              setValue(`materialQty${index}`, material.qty || 0);

              // Asignar el valor de materiaPrice
              setValue(`materialPrice${index}`, material.price || 0);
            });

            // Calcular el total de los precios multiplicando el precio por la cantidad
            const totalMaterialPrice = budgetData.data.materials.reduce(
              (acc, material) => {
                const price = material.price || 0;
                const qty = material.qty || 0;
                return acc + price * qty;
              },
              0
            );

            // Asignar los valores calculados
            setTotalMaterialPrice(totalMaterialPrice);
            setCountMaterial(budgetData.data.materials.length);
          }
        }

        //ITEMS EXTRA
        if (budgetData.data.extra_items) {
          if (budgetData.data.extra_items.length > 0) {
            budgetData.data.extra_items.forEach((extraItem, index) => {
              // Asignar el valor de materialTable
              setValue(`itemExtra${index}`, extraItem.name || "");

              // Asignar el valor de extraItemQty
              setValue(`itemExtraPrice${index}`, extraItem.price || 0);

              setCountItemExtra(budgetData.data.extra_items.length);
            });
          }
        }
        //CHAPA
        if (budgetData.data?.chapa) {
          if (budgetData.data.extra_items.length > 0) {
            budgetData.data.chapa.forEach((chapaItem, index) => {
              // Asignar el valor de chapa_price
              setValue("veneerSelect", chapaItem.veneerSelect || "");
              setValue("chapa_price", chapaItem.chapa_price || "");
              setChapa(chapaItem.chapa_price);
            });
          }
        }
        //ÍTEM DE AJUSTE
        setValue("adjustment_reason", budgetData.data.adjustment_reason || "");
        setValue("adjustment_price", budgetData.data.adjustment_price || "");

        //CLIENTE
        setClientOption("existing");
        setValue("clientOption", "existing");
        if (budgetData.data?.client) {
          if (budgetData.data.client.length > 0) {
            budgetData.data.client.forEach((clientEach, index) => {
              // Asignar el valor de chapa_price
              setValue(
                "clientNameInput",
                clientEach.lastname + " " + clientEach.name || ""
              );
              setValue("clientId", clientEach._id || "");
            });
          }
        }
        //COMENTARIOS
        setValue("comments", budgetData.data.comments || "");
        //FECHA DE ENTREGA
        setValue("deliver_date", budgetData.data.deliver_date || "");
        //COLOCACIÓN
        if (budgetData.data.placement) {
          setValue("placement", "true" || "");
          setValue("placementDays", budgetData.data.placement_days || "");
          setValue("placementPrice", budgetData.data.placement_price || "");
          setSubtotalPlacement(
            budgetData.data.placement_price * budgetData.data.placement_days
          );
        } else {
          setValue("placement", "false" || "");
        }

        //ENVÍO
        if (budgetData.data.shipment) {
          setValue("shipment", "true" || "");
          setValue("shipmentPrice", budgetData.data.placement_price || "");
          setSubtotalPlacement(
            budgetData.data.placement_price * budgetData.data.placement_days
          );
        } else {
          setValue("placement", "false" || "");
        }
        //MOSTRAR MÓDULOS
        setValue("showModules", budgetData.data.show_modules || "");

        //PRECIO TOTAL
        setTotalPrice(budgetData.data.total_price);
        //SER LOADER
        setLoader(false);
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

  useEffect(() => {
    getBudgetToSet();
    getAllServicesToSet();
    getAllTablesToSet();
    getAllEdgesToSet();
    getAllVeneerToSet();
    getAllClientsToSet();
  }, [budgetId, edgeSelect]);

  //Servicios: obetener valores
  const enchapadoArtesanalService = services.find(
    (service) => service._id === "66a5bbab218ee6221506c133"
  );

  const laqueadoService = services.find(
    (service) => service._id === "66a5bb29218ee6221506c125"
  );

  const laqueadoOpenService = services.find(
    (service) => service._id === "66eb0ec94bc129b0fcfb3dea"
  );

  const lustreService = services.find(
    (service) => service._id === "66a5bb50218ee6221506c12b"
  );

  const pantografiadoService = services.find(
    (service) => service._id === "66a5bb88218ee6221506c130"
  );

  const filoService = services.find(
    (service) => service._id === "66a5baea218ee6221506c119"
  );

  const cortePlacaService = services.find(
    (service) => service._id === "66a5baf9218ee6221506c11c"
  );

  //AL SELECCIONAR EL FILO OBTENER EL VALOR

  //filo laqueado
  const handleMaterialEdgeLaqueredOption = (event) => {
    let thickness = Number(event.target.value);
    console.log("handleMaterialEdgeLaqueredOption");
    // console.log(option);
    if (thickness > 0) {
      console.log(laqueadoService?.price, totalLacqueredEdgeLength, thickness);
      setMaterialEdgeLaquered(thickness);
      setValue(
        "edgeLaqueredPrice",
        laqueadoService?.price *
          ((totalLacqueredEdgeLength * thickness) / 1000).toFixed(2)
      );
      setValue(
        "edgeLaqueredM2",
        ((totalLacqueredEdgeLength * thickness) / 1000).toFixed(2)
      );
    } else {
      setMaterialEdgeLaquered(0);
      setValue("edgeLaqueredPrice", 0);
    }
    // calculateTotalPrice();
  };

  //filo lustrado
  const handleMaterialEdgePolishedOption = (event) => {
    let thickness = Number(event.target.value);
    console.log("handleMaterialEdgePolishedOption");
    if (thickness > 0) {
      console.log(
        "handleMaterialEdgePolishedOption",
        lustreService?.price,
        totalPolishedEdgeLength,
        thickness
      );
      setMaterialEdgePolished(thickness);
      // console.log(totalPolishedEdgeLength);
      setValue(
        "edgePolishedPrice",
        lustreService?.price *
          ((totalPolishedEdgeLength * thickness) / 1000).toFixed(2)
      );
      setValue(
        "edgePolishedM2",
        ((totalPolishedEdgeLength * thickness) / 1000).toFixed(2)
      );
    } else {
      setMaterialEdgePolished(0);
      setValue("edgePolishedPrice", 0);
    }
  };

  //filo común
  const handleMaterialEdgeOption = (event) => {
    let option = event.target.value;
    // console.log("handleMaterialEdgeOption");

    let selectedEdge = edges.find((edge) => edge._id === option);

    if (selectedEdge) {
      setMaterialEdge(selectedEdge.price);
      setValue(
        "edgePrice",
        Math.round((totalEdgeLength / 100) * selectedEdge.price * 3.8) +
          filoService?.price * (totalEdgeLength / 100)
      );
      // calculateTotalPrice();
    } else {
      setMaterialEdge(1);
      setValue(
        "edgePrice",
        Math.round((totalEdgeLength / 100) * 1 * 3.8) +
          filoService?.price * (totalEdgeLength / 100)
      );
      // calculateTotalPrice();
    }
  };

  useEffect(() => {
    handleMaterialEdgeOption({
      target: {
        value: edgeSelect,
      },
    });
  }, [services, edgeSelect]);

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
  // Manejar la selección del material
  const handleMaterialOption = (index) => (event) => {
    let option = event.target.value;

    if (option) {
      const selectedTable = tables.find((table) => table.name === option);
      setValue(`materialPrice${index}`, selectedTable.price, {
        shouldValidate: true,
      });
    } else {
      setValue(`materialPrice${index}`, 0, { shouldValidate: true });
    }
  };
  //CALCULAR TOTAL DE LOS MATERIALES
  const materialPrices = watch(
    Array.from({ length: countMaterial }, (_, index) => `materialPrice${index}`)
  );
  const materialQtys = watch(
    Array.from({ length: countMaterial }, (_, index) => `materialQty${index}`)
  );

  const calculateTotalMaterialPrice = (materialPrices, materialQtys) => {
    let subTotal = 0;
    let total = 0;
    let totalQty = 0;
    for (let index = 0; index < countMaterial; index++) {
      const price = Number(materialPrices[index]) || 0;
      const qty = Number(materialQtys[index]) || 0;
      subTotal += price * qty;
      total += price * qty;
      totalQty += qty;
    }
    subTotal = subTotal * 3.8 + totalQty * cortePlacaService?.price;
    total = total;
    // setSubtotalMaterialPrice(subTotal);
    setTotalMaterialPrice(total);
  };

  // Ejecutar cálculo automáticamente cuando cambien los precios o cantidades
  useEffect(() => {
    calculateTotalMaterialPrice(materialPrices, materialQtys);
  }, [materialPrices, materialQtys, countMaterial]);

  //CALCULAR TOTAL DE ITEMS EXTRA

  //CANTIDAD ITEMS EXTRA
  function counterItemExtra(e) {
    const action = e.target.innerText;
    let count;

    if (action === "+") {
      count = countItemExtra + 1;
    } else if (action === "-" && countItemExtra > 0) {
      count = countItemExtra - 1;

      // Remover los valores del último item extra cuando se reste
      unregister(`itemExtra${countItemExtra - 1}`);
      unregister(`itemExtraPrice${countItemExtra - 1}`);
    } else {
      count = 0;
    }

    setCountItemExtra(count);
  }

  const itemExtraPriceValues = watch(
    Object.keys(getValues()).filter((key) => key.startsWith("itemExtraPrice"))
  );

  // Función para calcular el total de los precios de itemExtraPrice
  const calculateSubTotalItemExtraPrice = () => {
    const total = itemExtraPriceValues.reduce(
      (acc, price) => acc + Number(price || 0),
      0
    );
    return total;
  };

  useEffect(() => {
    const total = calculateSubTotalItemExtraPrice();
    setSubTotalItemExtraPrice(total); // Actualiza el subtotal
  }, [itemExtraPriceValues]);

  //AL SELECCIONAR LA CHAPA OBTENER EL VALOR
  const handleChapaOption = (event) => {
    let option = event.target.value;
    // console.log(option);
    if (option) {
      const selectedVeneer = veneer.find((veneer) => veneer._id === option);
      let veneerPrice = selectedVeneer.price * (totalVeneer * 1.2);
      setValue("chapa_price", veneerPrice.toFixed(2));
      setChapa(veneerPrice);
    } else {
      setValue("chapa_price", 0);
      setChapa(0);
    }
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
  //filtro de clientes
  useEffect(() => {
    if (searchTerm === "") {
      console.log("if");
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

  //CALCULAR COLOCACIÓN
  const placementDays = watch("placementDays", 0);
  const placementPrice = watch("placementPrice", 0);

  useEffect(() => {
    const total = placementDays * placementPrice;
    // console.log("Total colocación:", total);
    setSubtotalPlacement(total);
    // Aquí puedes usar setState para guardar el valor si es necesario
  }, [placementDays, placementPrice]);

  //CALCULAR ENVÍO
  const shipmentPriceValue = Number(watch("shipmentPrice"));

  useEffect(() => {
    setSubtotalShipmentPrice(shipmentPriceValue);
    // console.log(shipmentPriceValue);
  }, [shipmentPriceValue]);

  //FORMULARIO EDITAR PRESUPUESTO
  const onSubmit = async (data, event) => {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <div className="p-8">
        <div className="flex gap-4">
          <h1 className="text-4xl">
            Editar Presupuesto N°{budget.budget_number}
          </h1>{" "}
          <Link
            to="/"
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver al Inicio
          </Link>
          <Link
            to={`/ver-presupuestos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
          >
            Volver a presupuestos
          </Link>
        </div>
        <h2 className="text-2xl mt-4">
          <span className="font-semibold">Mueble:</span> {singleFurniture?.name}{" "}
          -<span className="font-semibold"> Cliente:</span>{" "}
          {budget?.client?.[0]?.name} {budget?.client?.[0]?.lastname}
        </h2>
        <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
          <input
            name={`furniture_name`}
            type="hidden"
            value={singleFurniture?.name}
            {...register(`furniture_name`)}
          />
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Datos del Mueble</h2>
            <div className="flex gap-4">
              <p className="mb-1">
                <span className="font-bold">Alto:</span>{" "}
                {singleFurniture?.height}
              </p>
              <input
                name={`height`}
                type="hidden"
                value={singleFurniture?.height}
                {...register(`height`)}
              />
              <p className="mb-1">
                <span className="font-bold">Largo:</span>{" "}
                {singleFurniture?.length}
              </p>
              <input
                name={`length`}
                type="hidden"
                value={singleFurniture?.length}
                {...register(`length`)}
              />
              <p className="mb-1">
                <span className="font-bold">Profundidad:</span>{" "}
                {singleFurniture?.width}
              </p>
              <input
                name={`width`}
                type="hidden"
                value={singleFurniture?.width}
                {...register(`width`)}
              />
              <p className="mb-1">
                <span className="font-bold">Categoría:</span>{" "}
                {singleFurniture?.category}
              </p>{" "}
              <input
                name={`category`}
                type="hidden"
                value={singleFurniture?.category}
                {...register(`category`)}
              />
            </div>
            <div className="flex gap-16">
              <div className="w-1/3">
                <h2 className="text-2xl font-semibold mb-2">
                  Acabados del Mueble
                </h2>
                {/* ENCHAPADO ARTESANAL */}
                {totalVeneer > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">
                        Enchapado Artesanal en m2:
                      </span>{" "}
                      {totalVeneer} m<sup>2</sup> Precio:
                      {formatCurrency(
                        enchapadoArtesanalService?.price * totalVeneer
                      ).toLocaleString("es-ES")}
                      {setValue(
                        "veneerPrice",
                        enchapadoArtesanalService?.price * totalVeneer
                      )}
                    </p>
                    <input
                      name={`veneerM2`}
                      type="hidden"
                      value={totalVeneer}
                      {...register(`veneerM2`)}
                    />
                    <input
                      name={`veneerPrice`}
                      type="hidden"
                      value={enchapadoArtesanalService?.price * totalVeneer}
                      {...register(`veneerPrice`)}
                    />
                  </>
                ) : (
                  ""
                )}
                {/* LUSTRADO */}
                {totalVeneerPolished > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">Lustrado en m2:</span>{" "}
                      {totalVeneerPolished} m<sup>2</sup> Precio:
                      {formatCurrency(
                        lustreService?.price * totalVeneerPolished
                      )}
                      {setValue(
                        "veneerPolishedPrice",
                        lustreService?.price * totalVeneerPolished
                      )}
                    </p>
                    <input
                      name={`veneerPolishedM2`}
                      type="hidden"
                      value={totalVeneerPolished}
                      {...register(`veneerPolishedM2`)}
                    />
                    <input
                      name={`veneerPolishedPrice`}
                      type="hidden"
                      value={lustreService?.price * totalVeneerPolished}
                      {...register(`veneerPolishedPrice`)}
                    />
                  </>
                ) : (
                  ""
                )}
                {/* LAQUEADO */}
                {totalLacqueredAll > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">Laqueado en m2:</span>{" "}
                      {totalLacqueredAll} m<sup>2</sup> Precio:
                      {formatCurrency(
                        laqueadoService?.price * totalLacqueredAll
                      )}
                      {setValue(
                        "lacqueredPrice",
                        laqueadoService?.price * totalLacqueredAll
                      )}
                    </p>
                    <input
                      name={`lacqueredM2`}
                      type="hidden"
                      value={totalLacqueredAll}
                      {...register(`lacqueredM2`)}
                    />
                    <input
                      name={`lacqueredPrice`}
                      type="hidden"
                      {...register(`lacqueredPrice`)}
                      value={laqueadoService?.price * totalLacqueredAll}
                    />
                  </>
                ) : (
                  ""
                )}
                {/* LAQUEADO PORO ABIERTO */}
                {totalVeneerLacqueredOpen > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">
                        Laqueado Poro Abierto en m2:
                      </span>{" "}
                      {totalVeneerLacqueredOpen} m<sup>2</sup> Precio:
                      {formatCurrency(
                        laqueadoOpenService?.price * totalVeneerLacqueredOpen
                      )}
                      {setValue(
                        "lacqueredOpenPrice",
                        laqueadoOpenService?.price * totalVeneerLacqueredOpen
                      )}
                    </p>
                    <input
                      name={`lacqueredOpenM2`}
                      type="hidden"
                      value={totalVeneerLacqueredOpen / 10000}
                      {...register(`lacqueredOpenM2`)}
                    />
                    <input
                      name={`lacqueredOpenPrice`}
                      type="hidden"
                      {...register(`lacqueredOpenPrice`)}
                      value={
                        laqueadoOpenService?.price *
                        (totalVeneerLacqueredOpen / 10000)
                      }
                    />
                  </>
                ) : (
                  ""
                )}
                {/* PANTOGRAFIADO */}
                {totalPantographed > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">Pantografiado en m2:</span>{" "}
                      {totalPantographed} m<sup>2</sup> Precio:
                      {formatCurrency(
                        pantografiadoService?.price * totalPantographed
                      )}
                      {setValue(
                        "pantographedPrice",
                        pantografiadoService?.price * totalPantographed
                      )}
                    </p>
                    <input
                      name={`pantographedM2`}
                      type="hidden"
                      value={totalPantographed}
                      {...register(`pantographedM2`)}
                    />
                    <input
                      name={`pantographedPrice`}
                      type="hidden"
                      value={pantografiadoService?.price * totalPantographed}
                      {...register(`pantographedPrice`)}
                    />
                  </>
                ) : (
                  ""
                )}
                {/* FILO  laqueado*/}
                {totalLacqueredEdgeLength > 0 ? (
                  <>
                    <div className="flex gap-y-4">
                      <div>
                        <p className="font-bold">Filo Laqueado:</p>
                        <div className="flex flex-col w-2/3  ">
                          {materialEdgeLaquered > 0 ? (
                            <>
                              <p className="mb-1">
                                {(
                                  (totalLacqueredEdgeLength *
                                    materialEdgeLaquered) /
                                  1000
                                ).toFixed(2)}{" "}
                                m<sup>2</sup> Precio:
                                {formatCurrency(getValues("edgeLaqueredPrice"))}
                              </p>
                              <input
                                name={"edgeLaqueredM2"}
                                type="hidden"
                                {...register("edgeLaqueredM2")}
                              />

                              <input
                                name={`edgeLaqueredPrice`}
                                type="hidden"
                                {...register(`edgeLaqueredPrice`)}
                              />
                            </>
                          ) : (
                            <p className="text-red-500">Indicar grosor</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col w-2/4 ml-2">
                        <label htmlFor="edgeThickness" className="mb-2">
                          Grosor de la placa (cm)
                        </label>
                        <input
                          type="text"
                          name="edgeThickness"
                          id="edgeThickness"
                          className="border-solid border-2 border-opacity mb-2 rounded-md"
                          {...register("edgeThickness")}
                          onBlur={() => {
                            handleMaterialEdgeLaqueredOption({
                              target: { value: getValues("edgeThickness") },
                            });
                            // calculateTotalPrice();
                          }}
                        />
                        {errors.edgeThickness && (
                          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.edgeThickness.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {/* FILO  lustrado*/}
                {totalPolishedEdgeLength > 0 ? (
                  <>
                    <div className="flex gap-y-4">
                      <div>
                        <p className="font-bold">Filo Lustrado:</p>
                        <div className="flex flex-col w-2/3  ">
                          {materialEdgePolished > 0 ? (
                            <>
                              <p className="mb-1">
                                {(
                                  (totalPolishedEdgeLength *
                                    materialEdgePolished) /
                                  1000
                                ).toFixed(2)}{" "}
                                m<sup>2</sup> Precio:
                                {formatCurrency(getValues("edgePolishedPrice"))}
                              </p>
                              <input
                                name={`edgePolishedM2`}
                                type="hidden"
                                {...register(`edgePolishedM2`)}
                              />
                              <input
                                name={`edgePolishedPrice`}
                                type="hidden"
                                {...register(`edgePolishedPrice`)}
                              />
                            </>
                          ) : (
                            <p className="text-red-500">Indicar grosor</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col w-2/4 ml-2">
                        <label htmlFor="edgePolishedThickness" className="mb-2">
                          Grosor de la placa (cm)
                        </label>
                        <input
                          type="text"
                          name="edgePolishedThickness"
                          id="edgePolishedThickness"
                          className="border-solid border-2 border-opacity mb-2 rounded-md"
                          {...register("edgePolishedThickness")}
                          onBlur={() => {
                            handleMaterialEdgePolishedOption({
                              target: {
                                value: getValues("edgePolishedThickness"),
                              },
                            });
                            // calculateTotalPrice();
                          }}
                        />
                        {errors.edgeThickness && (
                          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors.edgeThickness.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {/* FILO  sin nada*/}
                {totalEdgeLength > 0 ? (
                  <>
                    <div className="flex gap-4">
                      <p className="flex flex-col mb-1">
                        <span className="font-bold">
                          Filo total (sin laquear):
                        </span>{" "}
                        <span>
                          {totalEdgeLength.toFixed(2)} m Precio:
                          {formatCurrency(
                            totalEdgeLength * materialEdge +
                              filoService?.price * totalEdgeLength
                          )}
                          {setValue(
                            "edgePrice",
                            Math.round(
                              totalEdgeLength * materialEdge * 3.8 +
                                filoService?.price * totalEdgeLength
                            )
                          )}
                        </span>
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
                  </>
                ) : (
                  ""
                )}
              </div>
              {/* INSUMOS */}
              {showSupplies ? (
                <div className="w-2/3">
                  <h2 className="text-2xl font-semibold mb-2">
                    Insumos totales del mueble{" "}
                    {formatCurrency(totalSuppliePrice)}
                  </h2>
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full">
                      <div className="p-4 rounded shadow">
                        {(() => {
                          return supplies.map((supply, index) => (
                            <div key={index} className="mb-2">
                              {/* Detalles de cada insumo */}
                              <p>
                                <span className="font-bold">Nombre:</span>{" "}
                                {supply.name}
                              </p>
                              <input
                                name={`supplieName${index}`}
                                type="hidden"
                                value={supply.name}
                                {...register(`supplieName${index}`)}
                              />
                              <p>
                                <span className="font-bold">Cantidad:</span>{" "}
                                {supply.qty}
                              </p>
                              <input
                                name={`supplieQty${index}`}
                                type="hidden"
                                value={supply.qty}
                                {...register(`supplieQty${index}`)}
                              />
                              {/* <p>
                                    <span className="font-bold">Largo:</span>{" "}
                                    {supply.length}
                                  </p> */}
                              <input
                                name={`supplieLength${index}`}
                                type="hidden"
                                value={supply.length}
                                {...register(`supplieLength${index}`)}
                              />
                              <p>
                                <span className="font-bold">Precio total:</span>{" "}
                                {formatCurrency(supply.price)}
                              </p>
                              <input
                                name={`suppliePrice${index}`}
                                type="hidden"
                                value={supply.price}
                                {...register(`suppliePrice${index}`)}
                              />
                            </div>
                          ));
                        })()}

                        {/* Agregar campos ocultos para los nombres de los módulos */}
                        {/* {sortedModules?.map((module, moduleIndex) => (
                            <input
                              key={moduleIndex}
                              name={`moduleName${moduleIndex}`}
                              type="hidden"
                              value={module.name}
                              {...register(`moduleName${moduleIndex}`)}
                            />
                          ))} */}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* cargar cantidad de placas a usar */}
          <div className="p-4 bg-gray-300 rounded-md shadow-md">
            <div className="flex items-center gap-2">
              <p className="text-md font-semibold">Cantidad de placas</p>
              {""}
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
                <p>{formatCurrency(totalMaterialPrice)}</p>
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
                      min="0"
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
                  <p>{formatCurrency(subTotalItemExtraPrice)}</p>
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
              {/* chapa enchapado artesanal*/}
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
                        onChange={(e) => {
                          handleChapaOption(e);
                          calculateTotalPrice();
                        }}
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

                    <div className="flex gap-x-6 w-1/4  ">
                      {" "}
                      <div>
                        <label htmlFor={`chapa_price`}>
                          M<sup>2</sup>
                        </label>
                        <p> {totalVeneer}</p>
                      </div>
                      <div>
                        <label htmlFor={`chapa_price`}>Precio chapa</label>
                        <p> {formatCurrency(chapa)}</p>
                      </div>
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
              {/* chapa enchapado artesanal fin*/}
              {/* chapa enchapado artesanal fin*/}
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
                    min="0"
                  />
                  {errors[`adjustment_price`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`adjustment_price`].message}
                    </span>
                  )}
                </div>
              </div>
              {/* item ajuste fin*/}
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
              {/* fin carga cliente */}
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
                    type="text"
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
              <div className="flex   my-4 gap-4">
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
                <div>
                  <label htmlFor="placementDays" className="mr-4">
                    Cant. Días
                  </label>
                  <input
                    name={`placementDays`}
                    type="number"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`placementDays`)}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="placementPrice" className="mr-4">
                    Precio
                  </label>
                  <input
                    name={`placementPrice`}
                    type="number"
                    className="border-solid border-2 border-opacity mb-2 rounded-md "
                    {...register(`placementPrice`)}
                    min="0"
                  />
                </div>
                <p>{formatCurrency(subtotalPlacement)}</p>
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
                  min="0"
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
              <p className="text-center">Total: {formatCurrency(totalPrice)}</p>
              {!submitLoader ? (
                <button
                  type="submit"
                  className="text-white bg-amber-600 rounded-md px-2 py-1 mb-2 w-1/6 m-auto"
                >
                  Editar presupuesto
                </button>
              ) : (
                <div className="flex justify-center w-full mt-8">
                  <div className="flex justify-center bg-lightblue rounded-md px-2 py-1 mb-2 w-1/6 m-auto">
                    <Oval
                      visible={submitLoader}
                      height="30"
                      width="30"
                      color="#fff"
                      secondaryColor="#fff"
                      strokeWidth="6"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export { EditBudget };
