import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid } from "react-loader-spinner";
import {
  getBudgetById,
  getAllServices,
  getAllTables,
  getAllEdgesSupplies,
} from "../../index.js";

function EditBudget() {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
        handleMaterialEdgeLaqueredOption({
          target: {
            value: budgetData.data.edge_lacquered[0].edgeLaqueredThickness,
          },
        });
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
        handleMaterialEdgeLaqueredOption({
          target: {
            value: budgetData.data.edge_polished[0].edgePolishedThickness,
          },
        });
        //FILO SIN NADA
        setTotalEdgeLength(Number(budgetData.data.edge_no_lacquered[0].edgeM2));
        setValue("edgeSelect", budgetData.data.edge_no_lacquered[0].edgeSelect);
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
  }, [budgetId]);

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
    console.log("thickness", totalPolishedEdgeLength);
    if (thickness > 0) {
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
    // console.log(option);

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
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export { EditBudget };
