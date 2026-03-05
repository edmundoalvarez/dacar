import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Grid, Oval } from "react-loader-spinner";
import QuillEditor from "../../components/QuillEditor.jsx";
import Select from "react-select";
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
  ViewModulesFurniture,
  uploadBudgetImage,
  getSystemVariableByKey,
} from "../../index.js";

//importar helpers de funciones
import { calculateTotalVeneer } from "../../helpers/Budgets/calculateTotalVeneer.js"; //calcular enchapados
import { calculateTotalMelamine } from "../../helpers/Budgets/calculateTotalMelamine.js";
import { calculateTotalEdges } from "../../helpers/Budgets/calculateTotalEdges.js";
import { formatComments } from "../../helpers/Budgets/formatComments.js";

function CreateBudget() {
  const {
    register,
    unregister,
    handleSubmit,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors },
    control,
  } = useForm();

  const { idFurniture } = useParams();
  const [submitLoader, setSubmitLoader] = useState(false);
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
  const [materialEdgePolished, setMaterialEdgePolished] = useState(0);
  const [chapa, setChapa] = useState(0);
  const [showSupplies, setShowSupplies] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSuppliePrice, setTotalSuppliePrice] = useState(0);
  const [subtotalMaterialPrice, setSubtotalMaterialPrice] = useState(0);
  const [totalMaterialPrice, setTotalMaterialPrice] = useState(0);
  const [subTotalItemExtraPrice, setSubTotalItemExtraPrice] = useState(0);
  const [subtotalAdjustmentPrice, setSubtotalAdjustmentPrice] = useState(0);
  const [subtotalPlacement, setSubtotalPlacement] = useState(0);
  const [subtotalShipmentPrice, setSubtotalShipmentPrice] = useState(0);
  const [hasUserEditedComments, setHasUserEditedComments] = useState(false);
  const commentsValue = watch("comments"); // opcional, útil para detectar cambios

  //Editor de texto
  const [commentValue, setCommentValue] = useState("");
  const [clientCommentValue, setClientCommentValue] = useState("");

  // Estado para imágenes adjuntas (múltiples)
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  // Coeficiente de cálculo (variable del sistema, default 3.8)
  const [calculationCoefficient, setCalculationCoefficient] = useState(3.8);
  const [coefficientInput, setCoefficientInput] = useState("3.8");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"], // dejamos solo B, I, U
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#10b981" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      minHeight: "40px",
      backgroundColor: "#ffffff",
      color: "#111827",
    }),
    menu: (base) => ({ ...base, zIndex: 30 }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
    input: (base) => ({
      ...base,
      color: "#111827",
    }),
    menuList: (base) => ({ ...base, backgroundColor: "#ffffff" }),
    option: (base, state) => ({
      ...base,
      color: "#111827",
      backgroundColor: state.isSelected
        ? "#d1fae5"
        : state.isFocused
          ? "#f3f4f6"
          : "#ffffff",
    }),
  };

  const tableOptions = tables.map((table) => ({
    value: table.name,
    label: table.name,
  }));

  const edgeOptions = edges.map((edge) => ({
    value: edge._id,
    label: edge.name,
  }));

  const veneerOptions = veneer.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const normalizeHtml = (html) => (typeof html === "string" ? html.trim() : "");

  const buildInitialComments = (parameterHtml, existingCommentHtml = "") => {
    const param = normalizeHtml(parameterHtml);
    const existing = normalizeHtml(existingCommentHtml);

    if (!param) return existing; // no hay parámetros -> no tocamos
    if (existing) return existing; // si ya había comentarios guardados, respetarlos

    // Comentario preescrito (solo parámetros)
    return param;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    getSystemVariableByKey("budget_calculation_coefficient", controller.signal)
      .then((variable) => {
        if (variable?.value != null && variable.value !== "") {
          const num = Number(variable.value);
          if (!Number.isNaN(num)) {
            setCalculationCoefficient(num);
            setCoefficientInput(String(num).replace(",", "."));
          }
        }
      })
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          console.error("Error al obtener coeficiente de cálculo:", err);
        }
      });
    return () => controller.abort();
  }, []);

  const getFurnituresToSet = () => {
    getFurnitureById(idFurniture)
      .then((furnituresData) => {
        const furniture = furnituresData?.data;
        setSingleFurniture(furniture);

        const modules = furniture?.modules_furniture || [];
        const allModulesEmpty = modules.every(
          (module) => (module.supplies_module || []).length === 0
        );
        setShowSupplies(!allModulesEmpty);

        // 1) De dónde sale el parámetro de categoria:
        // Si guardás parameter en mueble, usá furniture.parameter
        // Si viene de la categoría populada, usá furniture.category?.parameter
        const parameterHtml =
          furniture?.parameter || furniture?.category?.parameter || "";
        // 2) Solo precargar si el usuario todavía no tocó comentarios
        // y si el form todavía no tiene comentarios seteados
        const currentComments = normalizeHtml(getValues("comments"));
        if (!hasUserEditedComments && !currentComments) {
          const initial = buildInitialComments(parameterHtml, currentComments);

          setCommentValue(initial);
          setValue("comments", initial, { shouldValidate: true });
        }
      })
      .catch((error) => console.error("Este es el error:", error));
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

  useEffect(() => {
    getFurnituresToSet();
    getAllSuppliesToSet();
    getAllTablesToSet();
    getAllEdgesToSet();
    getAllVeneerToSet();
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

  //CÁLCULO DE TOTAL PIEZAS ENCHAPADAS EN METROS CUADRADOS
  const {
    totalVeneer,
    totalVeneer2,
    totalVeneerPolished,
    totalVeneerLacqueredOpen,
  } = calculateTotalVeneer(singleFurniture?.modules_furniture);

  //CÁLCULO DE TOTAL PIEZAS LAQUEADAS EN METROS CUADRADOS
  const calculateTotalLacquered = (modules) => {
    let totalLacquered = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.lacqueredPiece) {
          // console.log("piezas", piece.name, "piezas", piece.lacqueredPiece);
          if (piece.lacqueredPieceSides === 1) {
            totalLacquered += piece.length * piece.width * piece.qty;
          }
          if (piece.lacqueredPieceSides === 2) {
            totalLacquered += piece.length * piece.width * 2 * piece.qty;
          }
        }
      });
    });
    // console.log("totalLacquered", totalLacquered);
    return {
      totalLacquered,
    };
  };
  const { totalLacquered } = calculateTotalLacquered(
    singleFurniture?.modules_furniture
  );

  //CÁLCULO DE TOTAL PIEZAS MELAMINA EN METROS CUADRADOS
  const { totalMelamine, totalMelamineLacquered } = calculateTotalMelamine(
    singleFurniture?.modules_furniture
  );

  //CÁLCULO DE TOTAL PIEZAS PANTOGRAFIADAS EN METROS CUADRADOS
  const calculateTotalPantographed = (modules) => {
    let totalPantographed = 0;

    modules?.forEach((module) => {
      module.pieces.forEach((piece) => {
        if (piece.pantographed) {
          totalPantographed += piece.length * piece.width * piece.qty;
        }
      });
    });

    return {
      totalPantographed,
    };
  };
  const { totalPantographed } = calculateTotalPantographed(
    singleFurniture?.modules_furniture
  );

  //sumar total de laqueado
  let totalLacqueredAll = totalLacquered + totalMelamineLacquered;

  //ORDENAR POR NOMBRE LOS MÓDULOS
  const sortedModules = singleFurniture?.modules_furniture?.sort((a, b) =>
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

      // Remover los valores del último item extra cuando se reste
      unregister(`itemExtra${countItemExtra - 1}`);
      unregister(`itemExtraPrice${countItemExtra - 1}`);
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

  // Manejar selección de múltiples imágenes
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024;

    const validFiles = [];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(`"${file.name}" no es válido. Solo se permiten JPEG, PNG, GIF, WebP`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`"${file.name}" supera los 10MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const readers = validFiles.map((file) => {
      return new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((results) => {
      setSelectedImages((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...results]);
    });
    e.target.value = "";
  };

  // Eliminar imagen seleccionada por índice
  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const fileInput = document.getElementById("budgetImage");
    if (fileInput) fileInput.value = "";
  };

  // Mover imagen hacia arriba (primera = 1)
  const handleMoveImageUp = (index) => {
    if (index <= 0) return;
    setSelectedImages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  // Mover imagen hacia abajo
  const handleMoveImageDown = (index) => {
    if (index >= selectedImages.length - 1) return;
    setSelectedImages((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  //AL SELECCIONAR EL FILO OBTENER EL VALOR

  //filo laqueado
  const handleMaterialEdgeLaqueredOption = (event) => {
    let thickness = event.target.value;
    // console.log(option);
    if (thickness > 0) {
      setMaterialEdgeLaquered(thickness);

      setValue(
        "edgeLaqueredPrice",
        laqueadoService?.price *
          ((totalLacqueredEdgeLength * thickness) / 1000).toFixed(2)
      );
    } else {
      setMaterialEdgeLaquered(0);
      setValue("edgeLaqueredPrice", 0);
    }
    calculateTotalPrice();
  };

  //filo lustrado
  const handleMaterialEdgePolishedOption = (event) => {
    let thickness = event.target.value;
    // console.log(option);
    if (thickness > 0) {
      setMaterialEdgePolished(thickness);
      // console.log(totalPolishedEdgeLength);
      setValue(
        "edgePolishedPrice",
        lustreService?.price *
          ((totalPolishedEdgeLength * thickness) / 1000).toFixed(2)
      );
    } else {
      setMaterialEdgePolished(0);
      setValue("edgePolishedPrice", 0);
    }
    calculateTotalPrice();
  };

  //filo común
  const handleMaterialEdgeOption = (option) => {
    // console.log(option);
    const selectedEdge = edges.find((edge) => edge._id === option);

    if (selectedEdge) {
      setMaterialEdge(selectedEdge.price);
      setValue(
        "edgePrice",
        Math.round((totalEdgeLength / 100) * selectedEdge.price * calculationCoefficient) +
          filoService?.price * (totalEdgeLength / 100)
      );
      calculateTotalPrice();
    } else {
      setMaterialEdge(1);
      setValue(
        "edgePrice",
        Math.round((totalEdgeLength / 100) * 1 * calculationCoefficient) +
          filoService?.price * (totalEdgeLength / 100)
      );
      calculateTotalPrice();
    }
  };

  //AL SELECCIONAR LA CHAPA OBTENER EL VALOR
  const handleChapaOption = (option) => {
    // console.log(option);
    if (option) {
      const selectedVeneer = veneer.find((veneer) => veneer._id === option);
      let veneerPrice = selectedVeneer.price * ((totalVeneer / 10000) * 1.2);
      setValue("chapa_price", veneerPrice.toFixed(2));
      setChapa(veneerPrice);
    } else {
      setValue("chapa_price", 0);
      setChapa(0);
    }
  };

  // obtener el valor de corte de placa
  function getServicePriceById(id, servicesArray) {
    const service = servicesArray.find((service) => service._id === id);
    return service ? service.price : null;
  }

  const cortePlacaId = "66a5baf9218ee6221506c11c";
  const cortePlacaPrice = getServicePriceById(cortePlacaId, services);

  //CALCULAR TOTAL DEL PRECIO DE LOS INSUSMOS
  const calculateTotalSuppliePrice = () => {
    if (!singleFurniture?.modules_furniture) return 0; // Aseguramos que no sea undefined

    let total = 0;

    // Recorremos los módulos y suministros para calcular el total
    singleFurniture.modules_furniture.forEach((module) => {
      module.supplies_module.forEach((supply) => {
        const supplyDetails = supplies.find((s) => s._id === supply.supplie_id);

        if (supplyDetails) {
          // Calculamos el precio (precio por cantidad)
          const price = supplyDetails.price * supply.supplie_qty;
          total += price;
        }
      });
    });

    return total;
  };

  useEffect(() => {
    // Calculamos el total de los insumos
    const total = calculateTotalSuppliePrice();
    setTotalSuppliePrice(total); // Actualizamos el estado con el total calculado
  }, [singleFurniture, supplies]); // Dependencias necesarias para recalcular cuando cambian los módulos o insumos

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
    subTotal = subTotal * calculationCoefficient + totalQty * cortePlacaService?.price;
    total = total;
    setSubtotalMaterialPrice(subTotal);
    setTotalMaterialPrice(total);
  };

  // Ejecutar cálculo automáticamente cuando cambien los precios o cantidades
  useEffect(() => {
    calculateTotalMaterialPrice(materialPrices, materialQtys);
  }, [materialPrices, materialQtys, countMaterial, calculationCoefficient]);

  // Manejar la selección del material
  const handleMaterialOption = (index) => (option) => {
    if (option) {
      const selectedTable = tables.find((table) => table.name === option);
      setValue(`materialPrice${index}`, selectedTable.price, {
        shouldValidate: true,
      });
    } else {
      setValue(`materialPrice${index}`, 0, { shouldValidate: true });
    }
  };

  //CALCULAR TOTAL DE ITEMS EXTRA
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

  //CALCULAR AJUSTE
  const adjustmentPriceValue = Number(watch("adjustment_price"));

  useEffect(() => {
    setSubtotalAdjustmentPrice(adjustmentPriceValue);
    // console.log(adjustmentPriceValue);
  }, [adjustmentPriceValue]);

  //CALCULAR ENVÍO
  const shipmentPriceValue = Number(watch("shipmentPrice"));

  useEffect(() => {
    setSubtotalShipmentPrice(shipmentPriceValue);
    // console.log(shipmentPriceValue);
  }, [shipmentPriceValue]);

  //CALCULAR COLOCACIÓN
  const placementDays = watch("placementDays", 0);
  const placementPrice = watch("placementPrice", 0);

  useEffect(() => {
    const total = placementDays * placementPrice;
    // console.log("Total colocación:", total);
    setSubtotalPlacement(total);
    // Aquí puedes usar setState para guardar el valor si es necesario
  }, [placementDays, placementPrice]);

  //CÁLCULO TOTAL DE FILO
  const { totalEdgeLength, totalLacqueredEdgeLength, totalPolishedEdgeLength } =
    calculateTotalEdges(singleFurniture?.modules_furniture);

  //CALCULAR TOTAL COMPLETO
  const calculateTotalPrice = () => {
    let enchapado_artesanal_subtotal = Number(getValues("veneerPrice")) || 0;
    let lustrado_subtotal = Number(getValues("veneerPolishedPrice")) || 0;
    let laqueado_subtotal = Number(getValues("lacqueredPrice")) || 0;
    let laqueado_poro_subtotal = Number(getValues("lacqueredOpenPrice")) || 0;
    let pantografiado_subtotal = Number(getValues("pantographedPrice")) || 0;
    let chapa_price_subtotal = Number(getValues("chapa_price")) || 0;
    let filo_laqueado_subtotal = Number(getValues("edgeLaqueredPrice")) || 0;
    let filo_lustrado_subtotal = Number(getValues("edgePolishedPrice")) || 0;
    let filo_subtotal = Number(getValues("edgePrice")) || 0;

    //suma del total
    let totalPrice =
      (chapa_price_subtotal * calculationCoefficient || 0) +
      (enchapado_artesanal_subtotal * calculationCoefficient || 0) +
      (lustrado_subtotal || 0) +
      (laqueado_subtotal || 0) +
      (laqueado_poro_subtotal || 0) +
      (pantografiado_subtotal || 0) +
      (filo_laqueado_subtotal || 0) +
      (filo_lustrado_subtotal || 0) +
      (filo_subtotal || 0) +
      (totalSuppliePrice * calculationCoefficient || 0) +
      (subtotalMaterialPrice || 0) +
      (subTotalItemExtraPrice || 0) +
      (subtotalAdjustmentPrice || 0) +
      (subtotalPlacement || 0) +
      (subtotalShipmentPrice || 0);

    setTotalPrice(totalPrice);
  };
  const veneerPriceValue = getValues("veneerPrice");
  const chapaPriceValue = getValues("chapa_price");
  const edgeLaqueredPriceValue = getValues("edgeLaqueredPrice");
  const edgePriceValue = getValues("edgePrice");
  useEffect(() => {
    calculateTotalPrice();
    calculateTotalSuppliePrice();
  }, [
    singleFurniture,
    supplies,
    services,
    veneerPriceValue,
    chapaPriceValue,
    edgeLaqueredPriceValue,
    edgePriceValue,
    totalSuppliePrice,
    subtotalMaterialPrice,
    totalMaterialPrice,
    subTotalItemExtraPrice,
    subtotalAdjustmentPrice,
    subtotalPlacement,
    subtotalShipmentPrice,
    calculationCoefficient,
  ]);
  //Función para limpiar el objeto budgetData:
  function removeEmptyFields(obj) {
    // Recorremos las claves del objeto
    for (const key in obj) {
      // Preservar client_attachments si tiene contenido
      if (key === "client_attachments" && Array.isArray(obj[key]) && obj[key].length > 0) {
        continue;
      }
      // Preservar client_attachment si tiene contenido (legacy)
      if (key === "client_attachment" && obj[key] && obj[key].url) {
        continue;
      }

      if (
        obj[key] &&
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key])
      ) {
        // Si es un objeto, hacemos la limpieza recursivamente
        removeEmptyFields(obj[key]);
        // Si el objeto quedó vacío después de la limpieza, eliminarlo
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      } else if (
        obj[key] === undefined ||
        obj[key] === "" ||
        obj[key] === null
      ) {
        // Si el valor es undefined, null o una cadena vacía, eliminamos la clave
        delete obj[key];
      }
    }
    return obj;
  }

  //FORMULARIO GENERAR PRESUPUESTO
  const onSubmit = async (data, event) => {
    event.preventDefault();
    //SET LOADER
    setSubmitLoader(true);

    // Creación del objeto supplies agrupado por módulos
    const supplies = {};

    // Recorremos el objeto `data`
    Object.keys(data).forEach((key) => {
      // Extraemos el índice del nombre del insumo (asumiendo que siempre es suplieNameX, supliePriceX, etc.)
      const match = key.match(/supplie(Name|Price|Qty|Length)(\d+)/);
      if (match) {
        const [_, field, index] = match; // Capturamos el campo (Name, Price, Qty, Length) y el índice

        // Si no existe un objeto para este índice, lo creamos
        if (!supplies[index]) {
          supplies[index] = {};
        }

        // Asignamos los valores correspondientes según el campo
        switch (field) {
          case "Name":
            supplies[index].name = data[key];
            break;
          case "Price":
            supplies[index].price = Number(data[key]); // Convertimos a número
            break;
          case "Qty":
            supplies[index].qty = Number(data[key]); // Convertimos a número
            break;
          case "Length":
            supplies[index].length = Number(data[key]); // Convertimos a número
            break;
          default:
            break;
        }
      }
    });

    // Convertimos el objeto `supplies` en una lista de objetos
    const suppliesList = Object.values(supplies);

    // Carga cliente
    let clientData;
    // Código para crear o seleccionar cliente (comentado para ejemplo)
    if (clientOption === "new") {
      try {
        await createClient({
          ...data,
        }).then((res) => {
          clientData = res.data;
        });
      } catch (error) {
        console.error(error);
      }
    } else if (clientOption === "existing") {
      if (!data.clientId) {
        setError("clientId", {
          type: "manual",
          message: "Seleccioná un cliente",
        });
        setSubmitLoader(false);
        return;
      }
      try {
        await getClientById(data.clientId).then((res) => {
          clientData = res.data;
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (clientOption && !clientData) {
      setError("clientOption", {
        type: "manual",
        message: "No se pudo cargar el cliente",
      });
      setSubmitLoader(false);
      return;
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

    // Subir imágenes si hay alguna seleccionada
    let clientAttachments = [];
    if (selectedImages.length > 0) {
      try {
        setImageUploading(true);
        const uploadPromises = selectedImages.map((file) => uploadBudgetImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        clientAttachments = uploadResults.map((r) => ({
          url: r.url,
          original_name: r.original_name,
          mime_type: r.mime_type,
          size: r.size,
          path: r.path,
        }));
      } catch (error) {
        console.error("Error subiendo imágenes:", error);
        alert("Error al subir las imágenes: " + error.message);
        setSubmitLoader(false);
        setImageUploading(false);
        return;
      } finally {
        setImageUploading(false);
      }
    }

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
        chapa_price: Number(data.chapa_price),
      },
      lacqueredOpen: {
        lacqueredOpenM2: data.lacqueredOpenM2,
        lacqueredOpenPrice: data.lacqueredOpenPrice,
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
        edgeLaqueredThickness: Number(data.edgeThickness),
        edgeLaqueredM2: Number(data.edgeLaqueredM2),
        edgeLaqueredPrice: data.edgeLaqueredPrice,
        totalLacqueredEdgeLength: totalLacqueredEdgeLength,
      },
      edge_polished: {
        edgePolishedThickness: Number(data.edgePolishedThickness),
        edgePolishedM2: Number(data.edgePolishedM2),
        edgePolishedPrice: data.edgePolishedPrice,
        totalPolishedEdgeLength: totalPolishedEdgeLength,
      },
      edge_no_lacquered: {
        edgeSelect: data.edgeSelect,
        edgeM2: Number(data.edgeM2),
        edgePrice: data.edgePrice,
      },
      supplies: suppliesList,
      materials: materialsList,
      extra_items: extraItemsList,
      adjustment_reason: data.adjustment_reason,
      adjustment_price: Number(data.adjustment_price),
      total_price: totalPrice,
      deliver_date: data.deliver_date,
      comments: data.comments,
      client_comment: data.client_comment,
      client_attachments: clientAttachments,
      client: clientData,
      placement: data.placement,
      placement_days: data.placementDays,
      placement_price: Number(data.placementPrice),
      shipment: data.shipment,
      shipment_price: Number(data.shipmentPrice),
      show_modules: data.showModules,
      calculation_coefficient: calculationCoefficient,
    };

    const cleanedBudgetData = removeEmptyFields(budgetData);

    try {
      await createBudget(cleanedBudgetData);
      navigate("/ver-presupuestos");
    } catch (error) {
      console.error("Error creando presupuesto:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (!singleFurniture)
    return (
      <div className="overflow-x-auto my-8 flex justify-center items-center h-[100px]">
        <Grid
          visible={true}
          height="80"
          width="80"
          color="rgb(92, 92, 92)"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );

  return (
    <>
      <div className="pb-8 px-16 bg-gray-100 min-h-screen">
        <div className="shadow-sm flex gap-4 justify-between items-center mb-8 bg-gray-800 p-8 rounded-bl-2xl rounded-br-2xl border-b-2 border-b-emerald-500 border-l-2 border-l-emerald-500 border-r-2 border-r-emerald-500">
          <h1 className="text-4xl font-semibold text-white">
            Presupuestar el mueble: {singleFurniture?.name}
          </h1>
          <div className="flex items-center gap-4">
            <Link
              to={`/ver-muebles`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
            >
              <img
                src="./../icon_back.svg"
                alt="Icono de budgets"
                className="w-[18px]"
              />
              <p className="m-0 leading-loose">Volver</p>
            </Link>
            <Link
              to="/"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex flex-row justify-center align-middle items-center gap-2"
            >
              <img
                src="./../icon_home.svg"
                alt="Icono de budgets"
                className="w-[20px]"
              />
              <p className="m-0 leading-loose">Ir a Inicio</p>
            </Link>
          </div>
        </div>
        <form
          action=""
          className="flex flex-row flex-wrap gap-2 w-full max-w-full m-auto p-12 rounded-lg bg-white shadow-sm text-gray-700"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
              e.preventDefault(); // Prevenir el envío del formulario solo si no es un textarea
            }
          }}
        >
          <input
            name={`furniture_name`}
            type="hidden"
            value={singleFurniture?.name}
            {...register(`furniture_name`)}
          />
          <div className="p-0 pb-8 border-b-2 border-b-emerald-600 w-full mb-6">
            <h2 className="text-2xl font-semibold mb-2">Datos del Mueble</h2>
            <div className="flex gap-8 bg-emerald-600 text-white w-fit py-1 px-4 my-4 rounded">
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
                {singleFurniture?.category?.name}
              </p>{" "}
              <input
                name={`category`}
                type="hidden"
                value={singleFurniture?.category}
                {...register(`category`)}
              />
            </div>
            {/* Coeficiente de cálculo editable */}
            <div className="flex flex-row gap-4 items-center my-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
              <div className="flex flex-col w-1/4">
                <label
                  htmlFor="calculationCoefficient"
                  className="font-semibold text-gray-700 mb-1"
                >
                  Coeficiente de cálculo
                </label>
                <input
                  name="calculationCoefficient"
                  id="calculationCoefficient"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  className="border border-gray-300 rounded-md p-2"
                  value={coefficientInput}
                  onChange={(e) => {
                    // Reemplazar coma por punto y permitir solo números y un punto
                    let raw = e.target.value.replace(",", ".");
                    // Remover cualquier carácter que no sea número o punto
                    raw = raw.replace(/[^0-9.]/g, "");
                    // Asegurar que solo haya un punto
                    const parts = raw.split(".");
                    if (parts.length > 2) {
                      raw = parts[0] + "." + parts.slice(1).join("");
                    }
                    // Actualizar el input siempre para permitir escribir
                    setCoefficientInput(raw);
                    // Si hay un valor válido, actualizar también el estado principal
                    if (raw !== "" && raw !== ".") {
                      const value = parseFloat(raw);
                      if (!isNaN(value) && value >= 0) {
                        setCalculationCoefficient(value);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // Al perder el foco, asegurar que el valor sea válido
                    const raw = e.target.value.replace(",", ".");
                    const value = parseFloat(raw);
                    if (isNaN(value) || value < 0 || raw === "" || raw === ".") {
                      setCalculationCoefficient(3.8);
                      setCoefficientInput("3.8");
                    } else {
                      setCalculationCoefficient(value);
                      setCoefficientInput(String(value).replace(",", "."));
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 w-3/4">
                Este valor se usa para calcular el precio de materiales, insumos, chapas y filos.
                Por defecto usa el valor del sistema ({calculationCoefficient}), pero podés
                modificarlo para este presupuesto en particular.
              </p>
            </div>
            <div className="flex gap-16 w-full">
              <div className="w-1/2">
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
                      {totalVeneer / 10000} m<sup>2</sup> Precio:
                      {formatCurrency(
                        enchapadoArtesanalService?.price * (totalVeneer / 10000)
                      ).toLocaleString("es-ES")}
                      {setValue(
                        "veneerPrice",
                        enchapadoArtesanalService?.price * (totalVeneer / 10000)
                      )}
                    </p>
                    <input
                      className="border border-gray-300 rounded-md p-2"
                      name={`veneerM2`}
                      type="hidden"
                      value={totalVeneer / 10000}
                      {...register(`veneerM2`)}
                    />
                    <input
                      className="border border-gray-300 rounded-md p-2"
                      name={`veneerPrice`}
                      type="hidden"
                      value={
                        enchapadoArtesanalService?.price * (totalVeneer / 10000)
                      }
                      {...register(`veneerPrice`)}
                    />
                  </>
                ) : (
                  ""
                )}
                {/* ENCHAPADO NO ARTESANAL (no va porque es como melamina)*/}
                {/* {totalVeneer2 > 0 ? (
                  <>
                    <p className="mb-1">
                      <span className="font-bold">
                        Enchapado No Artesanal en m2:
                      </span>{" "}
                      {totalVeneer2 / 10000} m<sup>2</sup>
                    </p>
                    <input
                      name={`veneer2M2`}
                      type="hidden"
                      value={totalVeneer2 / 10000}
                      {...register(`veneerM2`)}
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
                      {totalVeneerPolished / 10000} m<sup>2</sup> Precio:
                      {formatCurrency(
                        lustreService?.price * (totalVeneerPolished / 10000)
                      )}
                      {setValue(
                        "veneerPolishedPrice",
                        lustreService?.price * (totalVeneerPolished / 10000)
                      )}
                    </p>
                    <input
                      className="border border-gray-300 rounded-md p-2"
                      name={`veneerPolishedM2`}
                      type="hidden"
                      value={totalVeneerPolished / 10000}
                      {...register(`veneerPolishedM2`)}
                    />
                    <input
                      className="border border-gray-300 rounded-md p-2"
                      name={`veneerPolishedPrice`}
                      type="hidden"
                      value={
                        lustreService?.price * (totalVeneerPolished / 10000)
                      }
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
                      {totalLacqueredAll / 10000} m<sup>2</sup> Precio:
                      {formatCurrency(
                        laqueadoService?.price * (totalLacqueredAll / 10000)
                      )}
                      {setValue(
                        "lacqueredPrice",
                        laqueadoService?.price * (totalLacqueredAll / 10000)
                      )}
                    </p>
                    <input
                      name={`lacqueredM2`}
                      type="hidden"
                      value={totalLacqueredAll / 10000}
                      {...register(`lacqueredM2`)}
                    />
                    <input
                      name={`lacqueredPrice`}
                      type="hidden"
                      {...register(`lacqueredPrice`)}
                      value={
                        laqueadoService?.price * (totalLacqueredAll / 10000)
                      }
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
                      {totalVeneerLacqueredOpen / 10000} m<sup>2</sup> Precio:
                      {formatCurrency(
                        laqueadoOpenService?.price *
                          (totalVeneerLacqueredOpen / 10000)
                      )}
                      {setValue(
                        "lacqueredOpenPrice",
                        laqueadoOpenService?.price *
                          (totalVeneerLacqueredOpen / 10000)
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
                      {totalPantographed / 10000} m<sup>2</sup> Precio:
                      {formatCurrency(
                        pantografiadoService?.price *
                          (totalPantographed / 10000)
                      )}
                      {setValue(
                        "pantographedPrice",
                        pantografiadoService?.price *
                          (totalPantographed / 10000)
                      )}
                    </p>
                    <input
                      name={`pantographedM2`}
                      type="hidden"
                      value={totalPantographed / 10000}
                      {...register(`pantographedM2`)}
                    />
                    <input
                      name={`pantographedPrice`}
                      type="hidden"
                      value={
                        pantografiadoService?.price *
                        (totalPantographed / 10000)
                      }
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
                                {formatCurrency(
                                  laqueadoService?.price *
                                    (
                                      (totalLacqueredEdgeLength *
                                        materialEdgeLaquered) /
                                      1000
                                    ).toFixed(2)
                                )}
                              </p>
                              <input
                                name={"edgeLaqueredM2"}
                                type="hidden"
                                value={(
                                  (totalLacqueredEdgeLength *
                                    materialEdgeLaquered) /
                                  1000
                                ).toFixed(2)}
                                {...register("edgeLaqueredM2")}
                              />

                              <input
                                name={`edgeLaqueredPrice`}
                                type="hidden"
                                value={
                                  laqueadoService?.price *
                                  (
                                    (totalLacqueredEdgeLength *
                                      materialEdgeLaquered) /
                                    1000
                                  ).toFixed(2)
                                }
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
                          className="border border-gray-300 rounded-md p-2"
                          {...register("edgeThickness")}
                          onBlur={() => {
                            handleMaterialEdgeLaqueredOption({
                              target: {
                                value: getValues("edgeThickness"),
                              },
                            });
                            calculateTotalPrice();
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
                                {formatCurrency(
                                  lustreService?.price *
                                    (
                                      (totalPolishedEdgeLength *
                                        materialEdgePolished) /
                                      1000
                                    ).toFixed(2)
                                )}
                              </p>
                              <input
                                name={`edgePolishedM2`}
                                type="hidden"
                                value={(
                                  (totalPolishedEdgeLength *
                                    materialEdgePolished) /
                                  1000
                                ).toFixed(2)}
                                {...register(`edgePolishedM2`)}
                              />
                              <input
                                name={`edgePolishedPrice`}
                                type="hidden"
                                value={
                                  lustreService?.price *
                                  (
                                    (totalPolishedEdgeLength *
                                      materialEdgePolished) /
                                    1000
                                  ).toFixed(2)
                                }
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
                          className="border border-gray-300 rounded-md p-2"
                          {...register("edgePolishedThickness")}
                          onBlur={() => {
                            handleMaterialEdgePolishedOption({
                              target: {
                                value: getValues("edgePolishedThickness"),
                              },
                            });
                            calculateTotalPrice();
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
                      <p className="flex flex-col mb-1 w-2/3">
                        <span className="font-bold w-full">
                          Filo total (sin laquear):
                        </span>{" "}
                        <span>
                          {(totalEdgeLength / 100).toFixed(2)} m Precio:
                          {formatCurrency(
                            (totalEdgeLength / 100) * materialEdge +
                              filoService?.price * (totalEdgeLength / 100)
                          )}
                          {setValue(
                            "edgePrice",
                            Math.round(
                              (totalEdgeLength / 100) * materialEdge * calculationCoefficient +
                                filoService?.price * (totalEdgeLength / 100)
                            )
                          )}
                        </span>
                      </p>
                      <input
                        className="border border-gray-300 rounded-md p-2"
                        name={`edgeM2`}
                        type="hidden"
                        value={(totalEdgeLength / 100).toFixed(2)}
                        {...register(`edgeM2`)}
                      />
                      <input
                        className="border border-gray-300 rounded-md p-2"
                        name={`edgePrice`}
                        type="hidden"
                        {...register(`edgePrice`)}
                      />

                      <div className="flex flex-col w-1/3 ">
                        <Controller
                          name="edgeSelect"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              inputId="edgeSelect"
                              instanceId="edgeSelect"
                              placeholder="Elegir una opción"
                              isClearable
                              options={edgeOptions}
                              value={
                                edgeOptions.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(option) => {
                                const value = option?.value || "";
                                field.onChange(value);
                                handleMaterialEdgeOption(value);
                              }}
                              styles={selectStyles}
                            />
                          )}
                        />
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
                <div className="w-1/2">
                  <h2 className="text-2xl font-semibold mb-2">
                    Insumos totales del mueble{" "}
                    {formatCurrency(totalSuppliePrice)}
                  </h2>
                  <div className="flex flex-wrap">
                    {sortedModules && sortedModules?.length > 0 && (
                      <div className="w-full">
                        <div className="rounded-lg overflow-hidden border-2 border-emerald-600">
                          {(() => {
                            let totalSupplieCost = 0; // Inicializar variable para el total

                            const consolidatedSupplies = sortedModules?.reduce(
                              (acc, module) => {
                                module?.supplies_module?.forEach((supply) => {
                                  const key = supply?.supplie_name;

                                  if (!acc[key]) {
                                    acc[key] = {
                                      name: supply?.supplie_name,
                                      qty: 0,
                                      length: supply?.supplie_length,
                                      price: 0,
                                    };
                                  }

                                  // Sumar la cantidad de insumos
                                  acc[key].qty += Number(supply?.supplie_qty);

                                  // Obtener detalles del suministro
                                  const supplyDetails = supplies?.find(
                                    (s) => s._id === supply?.supplie_id
                                  );
                                  if (supplyDetails) {
                                    const calculatedPrice =
                                      supplyDetails?.price *
                                      supply?.supplie_qty *
                                      (supply?.supplie_name === "Barral"
                                        ? supply?.supplie_length
                                        : 1);
                                    acc[key].price += calculatedPrice;

                                    // Sumar al total general
                                    totalSupplieCost += calculatedPrice;
                                  }
                                });
                                return acc;
                              },
                              {}
                            );

                            return Object.values(consolidatedSupplies).map(
                              (supply, index) => (
                                <div
                                  key={index}
                                  className={`mb-0 p-4 ${
                                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                                  }`}
                                >
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
                                    <span className="font-bold">
                                      Precio total:
                                    </span>{" "}
                                    {formatCurrency(supply.price)}
                                    {setValue(
                                      `suppliePrice${index}`,
                                      supply.price
                                    )}
                                  </p>
                                  <input
                                    name={`suppliePrice${index}`}
                                    type="hidden"
                                    value={supply.price}
                                    {...register(`suppliePrice${index}`)}
                                  />
                                </div>
                              )
                            );
                          })()}

                          {/* Agregar campos ocultos para los nombres de los módulos */}
                          {sortedModules?.map((module, moduleIndex) => (
                            <input
                              key={moduleIndex}
                              name={`moduleName${moduleIndex}`}
                              type="hidden"
                              value={module.name}
                              {...register(`moduleName${moduleIndex}`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* cargar cantidad de placas a usar */}
          <div className="py-6 w-full">
            <div className="flex items-center gap-2">
              <p className="text-2xl mr-6 uppercase font-semibold w-1/4">
                Cantidad de placas
              </p>
              {""}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                  onClick={counterMaterial}
                >
                  -
                </button>
                <p>Count: {countMaterial}</p>
                <p>{formatCurrency(totalMaterialPrice)}</p>
              </div>
            </div>

            <div className="flex flex-col my-6">
              {[...Array(countMaterial)].map((_, index) => (
                <div
                  key={`containerMaterial${index}`}
                  className="w-full flex flex-col mb-6"
                >
                  <div className="flex flex-row w-full  gap-0">
                    <div className="flex flex-row gap-4 w-1/2">
                      <div className="flex flex-col gap-2 w-1/2">
                        <label htmlFor={`materialTable${index}`}>
                          Seleccionar placa
                        </label>
                        <Controller
                          name={`materialTable${index}`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              inputId={`materialTable${index}`}
                              instanceId={`materialTable${index}`}
                              placeholder="Elegir una opción"
                              isClearable
                              options={tableOptions}
                              value={
                                tableOptions.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(option) => {
                                const value = option?.value || "";
                                field.onChange(value);
                                handleMaterialOption(index)(value);
                              }}
                              styles={selectStyles}
                            />
                          )}
                        />
                        {errors[`materialTable${index}`] && (
                          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors[`materialTable${index}`].message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-1/2">
                        <label htmlFor={`materialQty${index}`}>
                          Cantidad de placas
                        </label>
                        <input
                          name={`materialQty${index}`}
                          type="number"
                          className="border border-gray-300 rounded-md p-2"
                          {...register(`materialQty${index}`)}
                          min="0"
                        />
                        {errors[`materialQty${index}`] && (
                          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors[`materialQty${index}`].message}
                          </span>
                        )}
                      </div>

                      {/* placa price */}
                      <input
                        name={`materialPrice${index}`}
                        type="hidden"
                        {...register(`materialPrice${index}`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* item extra inicio */}
              <div className="flex items-center gap-2 mt-4">
                <p className="text-2xl mr-6 uppercase font-semibold w-1/4">
                  Items extra
                </p>{" "}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
                    onClick={counterItemExtra}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="text-lg font-semibold bg-emerald-500 text-white rounded-md h-7 w-7 flex items-center justify-center"
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
                  className="flex w-1/2 gap-4 mt-4"
                >
                  <div className="flex flex-col w-1/2">
                    <label htmlFor={`itemExtra${index}`}>Nombre</label>
                    <input
                      name={`itemExtra${index}`}
                      type="text"
                      className="border border-gray-300 rounded-md p-2"
                      {...register(`itemExtra${index}`)}
                    />
                    {errors[`itemExtra${index}`] && (
                      <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                        {errors[`itemExtra${index}`].message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label htmlFor={`itemExtraPrice${index}`}>Precio</label>
                    <input
                      name={`itemExtraPrice${index}`}
                      type="text"
                      className="border border-gray-300 rounded-md p-2"
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
                      <Controller
                        name="veneerSelect"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            inputId="veneerSelect"
                            instanceId="veneerSelect"
                            placeholder="Elegir una opción"
                            isClearable
                            options={veneerOptions}
                            value={
                              veneerOptions.find(
                                (option) => option.value === field.value
                              ) || null
                            }
                            onChange={(option) => {
                              const value = option?.value || "";
                              field.onChange(value);
                              handleChapaOption(value);
                              calculateTotalPrice();
                            }}
                            styles={selectStyles}
                          />
                        )}
                      />
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
                        <p> {totalVeneer / 10000}</p>
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
              {/* item ajuste */}
              <h3 className="pt-6 mb-0 font-semibold text-lg text-emerald-700 uppercase">
                Ítem de ajuste
              </h3>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/4  ">
                  {" "}
                  <label htmlFor={`adjustment_reason`}>Razón de ajuste</label>
                  <input
                    name={`adjustment_reason`}
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
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
                    step="any"
                    className="border border-gray-300 rounded-md p-2"
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
              <div className="flex flex-col my-6 w-1/2">
                <label className="mt-2 mb-2 font-semibold text-lg text-emerald-700 uppercase w-full">
                  ¿Cargar cliente o elegir uno existente?
                </label>
                <div className="flex items-center mb-2 mt-2">
                  <input
                    type="radio"
                    id="newClient"
                    value="new"
                    {...register(`clientOption`, {
                      required: "El campo es obligatorio",
                    })}
                    onChange={handleClientOption}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <label htmlFor="newClient" className="ml-2">
                    Cargar cliente
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="existingClient"
                    className="border border-gray-300 rounded-md p-2"
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
                  <div className="relative w-full mb-8">
                    <input
                      type="text"
                      placeholder="Buscar cliente por nombre"
                      {...register("clientNameInput")}
                      onChange={handleSearchTermChange}
                      className="border border-emerald-600 rounded-md p-2 w-1/2"
                    />
                    {filteredClients.length > 0 && (
                      <ul className="absolute z-20 border bg-white w-full max-h-40 overflow-y-auto shadow-lg">
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
                        validate: (value) =>
                          clientOption !== "existing" ||
                          (value && value.trim() !== "") ||
                          "Seleccioná un cliente",
                      })}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
              {/* fin carga cliente */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="comments" className="mb-2">
                    Comentarios
                  </label>

                  {/* Campo real de React Hook Form (oculto), donde se guarda el HTML */}
                  <input
                    type="hidden"
                    id="comments"
                    {...register("comments")}
                  />

                  {/* Editor visual */}
                  <QuillEditor
                    theme="snow"
                    value={commentValue}
                    onChange={(value) => {
                      if (!hasUserEditedComments)
                        setHasUserEditedComments(true);

                      setCommentValue(value);
                      setValue("comments", value, { shouldValidate: true });
                    }}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white border border-gray-300 rounded-md"
                  />

                  {errors.comments && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left">
                      {errors.comments.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="client_comment" className="mb-2">
                    Comentario para el cliente (opcional)
                  </label>

                  <input
                    type="hidden"
                    id="client_comment"
                    {...register("client_comment")}
                  />

                  <QuillEditor
                    theme="snow"
                    value={clientCommentValue}
                    onChange={(value) => {
                      setClientCommentValue(value);
                      setValue("client_comment", value, {
                        shouldValidate: true,
                      });
                    }}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-full   ">
                  {" "}
                  <label htmlFor={`deliver_date`}>Fecha de entrega</label>
                  <input
                    name={`deliver_date`}
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
                    {...register(`deliver_date`)}
                  />
                  {errors[`deliver_date`] && (
                    <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                      {errors[`deliver_date`].message}
                    </span>
                  )}
                </div>

                {/* Imágenes adjuntas del presupuesto */}
                <div className="flex flex-col w-full mt-4">
                  <label
                    htmlFor="budgetImage"
                    className="mb-2 font-semibold text-lg text-emerald-700 uppercase"
                  >
                    Imágenes adjuntas (opcional)
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Podés adjuntar varias fotos o imágenes de referencia del
                    presupuesto (máx. 10MB cada una)
                  </p>
                  <input
                    type="file"
                    id="budgetImage"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    multiple
                    className="border border-gray-300 rounded-md p-2 bg-white"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      <p className="text-sm text-gray-600 mb-2 w-full">
                        Vista previa ({imagePreviews.length} imagen{imagePreviews.length !== 1 ? "es" : ""}) — ordená con las flechas:
                      </p>
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative inline-block flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1">
                            <button
                              type="button"
                              onClick={() => handleMoveImageUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Mover antes"
                            >
                              ▲
                            </button>
                            <span className="text-xs font-semibold text-emerald-700 min-w-[24px] text-center">
                              {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMoveImageDown(index)}
                              disabled={index === imagePreviews.length - 1}
                              className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Mover después"
                            >
                              ▼
                            </button>
                          </div>
                          <div className="relative">
                            <img
                              src={preview}
                              alt={`Vista previa ${index + 1}`}
                              className="max-w-[300px] max-h-[200px] object-contain border border-gray-300 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                              title="Eliminar imagen"
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedImages[index]?.name} (
                            {(selectedImages[index]?.size / 1024).toFixed(1)} KB)
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-1/4 mt-4 gap-0">
                  <label htmlFor="placement">Colocación</label>
                  <select
                    name="placement"
                    id="placement"
                    className="border border-gray-300 rounded-md p-2"
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
                </div>
                <div className="flex flex-col w-1/4 mt-4 gap-0">
                  <label htmlFor="placementDays" className="mr-4">
                    Cant. Días
                  </label>
                  <input
                    name={`placementDays`}
                    type="number"
                    className="border border-gray-300 rounded-md p-2"
                    {...register(`placementDays`)}
                    min="0"
                  />
                </div>
                <div className="flex flex-col w-1/4 mt-4 gap-0">
                  <label htmlFor="placementPrice" className="mr-4">
                    Precio
                  </label>
                  <input
                    name={`placementPrice`}
                    type="number"
                    className="border border-gray-300 rounded-md p-2"
                    {...register(`placementPrice`)}
                    min="0"
                  />
                </div>
                <p className="flex flex-col w-1/4 mt-12 gap-0 font-bold text-left ml-4 text-xl">
                  {formatCurrency(subtotalPlacement)}
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-1/3 mt-4 gap-0">
                  <label htmlFor="shipment">Envío</label>
                  <select
                    name="shipment"
                    id="shipment"
                    className="border border-gray-300 rounded-md p-2"
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
                </div>{" "}
                <div className="flex flex-col w-1/3 mt-4 gap-0">
                  <label htmlFor="shipmentPrice">Precio</label>
                  <input
                    name={`shipmentPrice`}
                    type="number"
                    className="border border-gray-300 rounded-md p-2"
                    {...register(`shipmentPrice`)}
                    min="0"
                  />
                </div>
                <div className="flex flex-row justify-start align-middle items-center content-center mt-8 ml-8 gap-4  w-1/3">
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
              </div>
              <p className="text-right text-2xl font-bold my-10 w-full">
                Total: {formatCurrency(totalPrice)}
              </p>
              {!submitLoader && !imageUploading ? (
                <div className="w-full">
                  <button
                    type="submit"
                    className="bg-orange text-white font-medium py-2 px-6 rounded-lg shadow-md mt-6 transition duration-200 w-full"
                  >
                    Generar presupuesto
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full mt-8">
                  <div className="flex justify-center bg-lightblue rounded-md px-2 py-1 mb-2 w-1/6 m-auto">
                    <Oval
                      visible={submitLoader || imageUploading}
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
                  {imageUploading && (
                    <p className="text-sm text-gray-600">Subiendo imágenes...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
        <ViewModulesFurniture
          sortedModules={sortedModules}
        ></ViewModulesFurniture>
      </div>
    </>
  );
}

export { CreateBudget };
