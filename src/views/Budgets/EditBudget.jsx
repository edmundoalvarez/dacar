import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid } from "react-loader-spinner";
import { getBudgetById, getAllServices, getAllTables } from "../../index.js";

function EditBudget() {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
  const [loader, setLoader] = useState(true);
  const [singleFurniture, setSingleFurniture] = useState(null);
  const [totalVeneer, setTotalVeneer] = useState(0);
  const [totalVeneerPolished, setTotalVeneerPolished] = useState(0);
  const [totalLacqueredAll, setTotalLacqueredAll] = useState(0);
  const [totalPantographed, setTotalPantographed] = useState(0);
  const [totalLacqueredEdgeLength, setTotalLacqueredEdgeLength] = useState(0);
  const [totalEdgeLength, setTotalEdgeLength] = useState(0);
  const [services, setServices] = useState([]);
  const [materialEdgeLaquered, setMaterialEdgeLaquered] = useState(0);
  const [materialEdge, setMaterialEdge] = useState(1);
  const [tables, setTables] = useState([]);
  const [edges, setEdges] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getBudgetToSet = () => {
    getBudgetById(budgetId)
      .then((budgetData) => {
        console.log(budgetData.data);
        console.log(budgetData.data.furniture[0]);
        setBudget(budgetData.data);
        setSingleFurniture(budgetData.data.furniture[0]);
        setTotalVeneer(Number(budgetData.data.veneer[0].veneerM2));
        setTotalVeneerPolished(
          Number(budgetData.data.veneerPolished[0].veneerPolishedM2)
        );
        setTotalLacqueredAll(Number(budgetData.data.lacquered[0].lacqueredM2));
        setTotalPantographed(
          Number(budgetData.data.pantographed[0].pantographedM2)
        );
        setTotalLacqueredEdgeLength(
          Number(budgetData.data.edge_lacquered[0].edgeLaqueredM2)
        );
        setTotalEdgeLength(Number(budgetData.data.edge_no_lacquered[0].edgeM2));
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

  useEffect(() => {
    getBudgetToSet();
    getAllTablesToSet();
    getAllServicesToSet();
  }, [budgetId]);

  //Servicios: obetener valores
  const enchapadoArtesanalService = services.find(
    (service) => service.name === "Enchapado Artesanal"
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

  //filo laqueado
  const handleMaterialEdgeLaqueredOption = (event) => {
    let option = event.target.value;
    // console.log(option);
    const selectedTable = tables.find((table) => table._id === option);

    if (selectedTable) {
      setMaterialEdgeLaquered(selectedTable.thickness);
      console.log("selectedTable.thickness", selectedTable.thickness);
    } else {
      setMaterialEdgeLaquered(0);
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
                {/* FILO */}
                {totalLacqueredEdgeLength > 0 ? (
                  <>
                    <div className="flex gap-y-4">
                      <p className="font-bold">Filo total (laqueado):</p>
                      <div className="flex flex-col w-1/3  ">
                        {materialEdgeLaquered > 0 ? (
                          <>
                            <p className="mb-1">
                              {totalLacqueredEdgeLength.toFixed(2)} m
                              <sup>2</sup> Precio:
                              {formatCurrency(
                                laqueadoService?.price *
                                  (totalLacqueredEdgeLength *
                                    materialEdgeLaquered)
                              )}
                              {setValue(
                                "edgeLaqueredPrice",
                                laqueadoService?.price *
                                  (
                                    totalLacqueredEdgeLength *
                                    materialEdgeLaquered
                                  ).toFixed(2)
                              )}
                            </p>
                            <input
                              name={`edgeLaqueredM2`}
                              type="hidden"
                              value={(
                                totalLacqueredEdgeLength * materialEdgeLaquered
                              ).toFixed(2)}
                              {...register(`edgeLaqueredM2`)}
                            />
                            <input
                              name={`edgeLaqueredPrice`}
                              type="hidden"
                              value={
                                laqueadoService?.price *
                                (
                                  totalLacqueredEdgeLength *
                                  materialEdgeLaquered
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
                  </>
                ) : (
                  ""
                )}
                {totalEdgeLength > 0 ? (
                  <>
                    <div className="flex gap-4">
                      <p className="mb-1">
                        <span className="font-bold">
                          Filo total (sin laquear):
                        </span>{" "}
                        {totalEdgeLength.toFixed(2)} m Precio:
                        {formatCurrency(
                          filoService?.price * totalEdgeLength * materialEdge
                        )}
                        {setValue(
                          "edgePrice",
                          filoService?.price * totalEdgeLength * materialEdge
                        )}
                      </p>
                      <input
                        name={`edgeM2`}
                        type="hidden"
                        value={totalEdgeLength.toFixed(2)}
                        {...register(`edgeM2`)}
                      />
                      <input
                        name={`edgePrice`}
                        type="hidden"
                        value={
                          filoService?.price * totalEdgeLength * materialEdge
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
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export { EditBudget };
