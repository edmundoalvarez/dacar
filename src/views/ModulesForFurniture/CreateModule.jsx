import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createModule,
  FormCreatePieces,
  FormAddSupplies,
  createPieces,
  getAllTables,
  getAllSuppliesExceptTables,
} from "../../index.js";

function CreateModule() {
  const navigation = useNavigate();
  const [piecesCount, setPiecesCount] = useState(0);
  const [suppliesCount, setSuppliesCount] = useState(0);
  const [tables, setTables] = useState([]);
  const [supplies, setSupplies] = useState([]);

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

  // TRAER INSUMOS: para el formulario de insumos, se le pasar por prop
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

  // FORMULARIO PARA CREAR
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      // Crear el módulo y obtener el ID del módulo creado
      const { name, length, width, category, piecesNumber } = data; // Extraer datos relevantes para el módulo
      console.log(data);
      const supplies_module = [...Array(suppliesCount)].map((_, index) => {
        const supplyIdName = data[`supplie_id_name${index}`];
        const [supplie_id, supplie_name] = supplyIdName.split("-");

        return {
          supplie_id,
          supplie_name,
          supplie_qty: data[`supplie_qty${index}`],
          supplie_length: data[`supplie_length${index}`],
        };
      });

      const moduleData = {
        name,
        length,
        width,
        height: data.height,
        category,
        pieces_number: piecesNumber,
        supplies_module, // Asignar el array de insumos
      }; // Crear objeto moduleData con los datos del módulo
      const moduleId = await createModule(moduleData);
      console.log("¡Creaste el módulo con éxito!");

      // Crear las piezas asociadas al módulo
      for (let i = 0; i < piecesCount; i++) {
        let lacqueredPiece;
        let veneer;
        let melamine;
        if (data[`finishing${i}`] === "lacqueredPiece") {
          lacqueredPiece = true;
          veneer = false;
          melamine = false;
        }
        if (data[`finishing${i}`] === "veneer") {
          lacqueredPiece = false;
          veneer = true;
          melamine = false;
        }
        if (data[`finishing${i}`] === "melamine") {
          lacqueredPiece = false;
          veneer = false;
          melamine = true;
        }

        const pieceData = {
          // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
          name: data[`namePiece${i}`],
          length: data[`lengthPiece${i}`],
          width: data[`widthPiece${i}`],
          orientation: data[`orientation${i}`],
          category: data[`categoryPiece${i}`],
          material: data[`materialPiece${i}`],
          lacqueredPiece: lacqueredPiece,
          lacqueredPieceSides: data[`lacqueredPieceSides${i}`],
          veneer: veneer,
          veneerFinishing: data[`veneerOption${i}`],
          melamine: melamine,
          melamineLacquered: data[`melamineLacquered${i}`],
          pantographed: data[`pantographed${i}`],
          edgeLength: data[`edgeLength${i}`],
          edgeLengthSides: data[`edgeLengthSides${i}`],
          edgeWidth: data[`edgeWidth${i}`],
          edgeWidthSides: data[`edgeWidthSides${i}`],
          lacqueredEdge: data[`lacqueredEdge${i}`],
          moduleId, // Asigna el ID del módulo a cada pieza
        };
        await createPieces(pieceData);
      }

      setTimeout(() => {
        navigation(`/ver-modulos`);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePiecesCountChange = (e) => {
    setPiecesCount(Number(e.target.value));
  };

  const handleSuppliesCountChange = (e) => {
    setSuppliesCount(Number(e.target.value));
  };

  // traer las placas e insumos
  useEffect(() => {
    getAllTablesToSet();
    getAllSuppliesToSet();
  }, []);

  return (
    <div className="m-4">
      <div className="flex gap-4">
        <h1 className="text-4xl">Crear Módulo</h1>
        <Link
          to="/"
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
        >
          Volver al Inicio
        </Link>
        <Link
          to={`/ver-modulos`}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
        >
          Ver Módulos
        </Link>
      </div>
      <form
        action=""
        className="flex flex-wrap w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-3/12 my-2">
          <label htmlFor="name">Nombre del módulo</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="name"
            id="name"
            {...register("name", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.name && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-3/12 my-2 ">
          <label htmlFor="height">Alto</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="height"
            id="height"
            {...register("height", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.height && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.height.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-3/12 my-2">
          <label htmlFor="length">Largo</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="length"
            id="length"
            {...register("length", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.length && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.length.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-3/12 my-2">
          <label htmlFor="width">Profundidad</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="width"
            id="width"
            {...register("width", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.width && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.width.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-3/12 my-2">
          <label htmlFor="category">Categoria</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="text"
            name="category"
            id="category"
            {...register("category", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.category && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.category.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-full my-2">
          <h2 className="text-3xl">Insumos</h2>
          <label htmlFor="suppliesNumber">Cantidad de insumos</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-3/12"
            type="number"
            name="suppliesNumber"
            id="suppliesNumber"
            {...register("suppliesNumber")}
            onChange={handleSuppliesCountChange}
          />
          {errors.suppliesNumber && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.suppliesNumber.message}
            </span>
          )}
        </div>

        {[...Array(suppliesCount)].map((_, index) => (
          <FormAddSupplies
            key={index}
            register={register}
            index={index}
            errors={errors}
            supplies={supplies}
          />
        ))}
        <h2 className="text-3xl">Piezas</h2>
        <div className="flex flex-col w-full my-2">
          <label htmlFor="piecesNumber">Cantidad de piezas</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-3/12"
            type="number"
            name="piecesNumber"
            id="piecesNumber"
            {...register("piecesNumber", {
              required: "El campo es obligatorio",
            })}
            onChange={handlePiecesCountChange}
          />
          {errors.piecesNumber && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.piecesNumber.message}
            </span>
          )}
        </div>

        {[...Array(piecesCount)].map((_, index) => (
          <FormCreatePieces
            key={`FormCreatePiecess${index}`}
            register={register}
            index={index}
            errors={errors}
            tables={tables}
            resetField={resetField}
          />
        ))}
        <div className="w-full">
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white px-4 rounded-md"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

export { CreateModule };
