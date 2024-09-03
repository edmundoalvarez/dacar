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
      const { name, length, width, material } = data; // Extraer datos relevantes para el módulo
      console.log("data del form", data);
      const supplies_module = [...Array(suppliesCount)].map((_, index) => {
        const supplyIdName = data[`supplie_id_name${index}`];
        const [supplie_id, supplie_name] = supplyIdName.split("##");

        return {
          supplie_id,
          supplie_name,
          supplie_qty: data[`supplie_qty${index}`],
          supplie_length: data[`supplie_length${index}`],
        };
      });
      let piecesNumber = 0;
      for (let i = 0; i < piecesCount; i++) {
        const qty =
          data[`qty${i}`] !== undefined &&
          data[`qty${i}`] !== "" &&
          Number(data[`qty${i}`]) !== 0
            ? Number(data[`qty${i}`])
            : 1;

        piecesNumber += qty;
      }

      const moduleData = {
        name,
        length,
        width,
        height: data.height,
        material,
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
        const qty =
          data[`qty${i}`] !== undefined &&
          data[`qty${i}`] !== "" &&
          Number(data[`qty${i}`]) !== 0
            ? Number(data[`qty${i}`])
            : 1;

        const pieceData = {
          // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
          name: data[`namePiece${i}`],
          qty,
          length: data[`lengthPiece${i}`],
          width: data[`widthPiece${i}`],
          orientation: data[`orientation${i}`],
          comment: data[`commentPiece${i}`],
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
          loose_piece: data[`loose_piece${i}`],
          moduleId, // Asigna el ID del módulo a cada pieza
        };
        await createPieces(pieceData);
      }

      navigation(`/ver-modulos`);
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
    <div className="m-4 px-4">
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
        <div className="flex flex-col w-4/12 my-2">
          <label className="font-semibold mb-1" htmlFor="name">
            Nombre del módulo
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
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

        <div className="flex flex-col w-2/12  my-2 ml-4">
          <label className="font-semibold mb-1" htmlFor="length">
            Largo
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
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
        <div className="flex flex-col w-2/12 my-2 ml-4">
          <label className="font-semibold mb-1" htmlFor="height">
            Alto
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
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
        <div className="flex flex-col w-2/12 my-2 ml-4">
          <label className="font-semibold mb-1" htmlFor="width">
            Profundidad
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
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
          <label className="font-semibold mb-1" htmlFor="material">
            Material
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name="material"
            id="material"
            {...register("material", {
              required: "El campo es obligatorio",
            })}
          />
          {errors.material && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.material.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-full my-2">
          <h2 className="text-3xl">Insumos</h2>
          <label className="font-semibold mb-1" htmlFor="suppliesNumber">
            Cantidad de insumos
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-1/12"
            type="number"
            name="suppliesNumber"
            id="suppliesNumber"
            {...register("suppliesNumber")}
            onChange={handleSuppliesCountChange}
            min="0"
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
          <label className="font-semibold mb-1" htmlFor="piecesNumber">
            Cantidad de piezas
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-1/12"
            type="number"
            name="piecesNumber"
            id="piecesNumber"
            {...register("piecesNumber", {
              required: "El campo es obligatorio",
            })}
            onChange={handlePiecesCountChange}
            min="0"
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
