import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FormEditPieces,
  FormEditSupplies,
  getAllTables,
  getAllSuppliesExceptTables,
  getFurnitureById,
  updateModuleOfFurniture,
} from "../../index.js";

function EditFurnitureSingleModuleComponent({
  idFurniture,
  idModule,
  onModified,
  notModified,
}) {
  const navigate = useNavigate();
  const [piecesCount, setPiecesCount] = useState(0);
  const [suppliesCount, setSuppliesCount] = useState(0);
  const [tables, setTables] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [currentModule, setCurrentModule] = useState(null); // Estado para almacenar el módulo actual
  const [moduleOriginalHeight, setModuleOriginalHeight] = useState(null);
  const [moduleOriginalLength, setModuleOriginalLength] = useState(null);
  const [moduleOriginalWidth, setModuleOriginalWidth] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    resetField,
    formState: { errors },
  } = useForm();

  // Obtener datos del mueble por ID
  const getFurnitureData = () => {
    if (!idFurniture) {
      console.error("idFurniture is undefined");
      return;
    }

    getFurnitureById(idFurniture)
      .then((furnitureData) => {
        const furniture = furnitureData.data;

        // Buscar el módulo con el ID `idModule`
        const module = furniture.modules_furniture.find(
          (mod) => mod._id === idModule
        );
        if (!module) {
          console.error("Module not found");
          return;
        }

        setCurrentModule(module); // Guardar el módulo en el estado

        // Rellenar el formulario con los datos del módulo
        setModuleOriginalHeight(module.height || 0);
        setModuleOriginalLength(module.length || 0);
        setModuleOriginalWidth(module.width || 0);
        setPiecesCount(module.pieces.length || 0);
        setSuppliesCount(module.supplies_module.length || 0);
        reset(module);

        // Establecer valores iniciales para insumos y piezas
        module.supplies_module.forEach((supply, index) => {
          setValue(
            `supplie_id_name${index}`,
            `${supply.supplie_id}-${supply.supplie_name}`
          );
          setValue(`supplie_qty${index}`, supply.supplie_qty);
          setValue(`supplie_length${index}`, supply.supplie_length);
        });

        module.pieces.forEach((piece, index) => {
          setValue(`namePiece${index}`, piece.name);
          setValue(`qty${index}`, piece.qty);
          setValue(`lengthPiece${index}`, piece.length.toString());
          setValue(`widthPiece${index}`, piece.width.toString());
          setValue(`orientation${index}`, piece.orientation);
          setValue(`commentPiece${index}`, piece.comment);
          setValue(`materialPiece${index}`, piece.material);
          setValue(`lacqueredPiece${index}`, piece.lacqueredPiece);
          setValue(`lacqueredPieceSides${index}`, piece.lacqueredPieceSides);
          setValue(`veneer${index}`, piece.veneer);
          setValue(`veneerOption${index}`, piece.veneerFinishing);
          setValue(
            `veneerLacqueredPieceSides${index}`,
            piece.veneerLacqueredPieceSides
          );
          setValue(`veneerLacqueredOpen${index}`, piece.veneerLacqueredOpen);
          setValue(`veneer2${index}`, piece.veneer2);
          setValue(`veneer2Option${index}`, piece.veneer2Finishing);
          setValue(
            `veneer2LacqueredPieceSides${index}`,
            piece.veneer2LacqueredPieceSides
          );
          setValue(`veneer2LacqueredOpen${index}`, piece.veneer2LacqueredOpen);
          setValue(`melamine${index}`, piece.melamine);
          setValue(`melamineLacquered${index}`, piece.melamineLacquered);
          setValue(
            `melamineLacqueredPieceSides${index}`,
            piece.melamineLacqueredPieceSides
          );
          setValue(`pantographed${index}`, piece.pantographed);
          setValue(`edgeLength${index}`, piece.edgeLength);
          setValue(`edgeLengthSides${index}`, piece.edgeLengthSides);
          setValue(`edgeWidth${index}`, piece.edgeWidth);
          setValue(`edgeWidthSides${index}`, piece.edgeWidthSides);
          if (piece.lacqueredEdge) {
            setValue(`edgeType${index}`, "lacquered");
          }
          if (piece.polishedEdge) {
            setValue(`edgeType${index}`, "polished");
          }
          // console.log("piece", `edgeLength${index}`, piece.edgeLength);
        });
      })
      .catch((error) => {
        console.error("Error fetching furniture data:", error);
      });
  };

  // TRAER PLACAS: para el formulario de las piezas, se le pasar por prop
  const getAllTablesToSet = () => {
    getAllTables()
      .then((tablesData) => {
        setTables(tablesData.data);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  };

  // TRAER INSUMOS: para el formulario de insumos, se le pasar por prop
  const getAllSuppliesToSet = () => {
    getAllSuppliesExceptTables()
      .then((supplieData) => {
        setSupplies(supplieData.data);
      })
      .catch((error) => {
        console.error("Error fetching supplies:", error);
      });
  };

  //AGREGAR MAS INSUMOS

  const handleSuppliesCountChange = (e) => {
    setSuppliesCount(Number(e.target.value));
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      const {
        name,
        height,
        heightHidden,
        length,
        lengthHidden,
        width,
        widthHidden,
        material,
      } = data;

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

      const pieces = [...Array(piecesCount)].map((_, index) => {
        let qty =
          data[`qty${index}`] !== undefined &&
          data[`qty${index}`] !== "" &&
          Number(data[`qty${index}`]) !== 0
            ? Number(data[`qty${index}`])
            : 1;
        piecesNumber += qty;

        let lacqueredPiece;
        let veneer;
        let veneer2;
        let melamine;
        if (data[`finishing${index}`] === "lacqueredPiece") {
          lacqueredPiece = true;
          veneer = false;
          veneer2 = false;
          melamine = false;
        }
        if (data[`finishing${index}`] === "veneer") {
          lacqueredPiece = false;
          veneer = true;
          veneer2 = false;
          melamine = false;
        }
        if (data[`finishing${index}`] === "veneer2") {
          lacqueredPiece = false;
          veneer = false;
          veneer2 = true;
          melamine = false;
        }
        if (data[`finishing${index}`] === "melamine") {
          lacqueredPiece = false;
          veneer = false;
          veneer2 = false;
          melamine = true;
        }

        let lacqueredEdge = false;
        let polishedEdge = false;

        if (data[`edgeType${index}`] === "lacquered") {
          lacqueredEdge = true;
        }

        if (data[`edgeType${index}`] === "polished") {
          polishedEdge = true;
        }

        //lo que viene de la pieza
        let lengthPiece = parseFloat(data[`lengthPiece${index}`]);
        let widthPiece = parseFloat(data[`widthPiece${index}`]);
        //variables para cargar el dato
        let pieceLength;
        let pieceWidth;
        if (data[`orientation${index}`] === "cross-vertical") {
          if (height >= heightHidden) {
            pieceLength =
              lengthPiece +
              (height - heightHidden) * (lengthPiece / heightHidden);
          }
          if (height < heightHidden) {
            pieceLength =
              lengthPiece -
              (heightHidden - height) * (lengthPiece / heightHidden);
          }

          if (length >= lengthHidden) {
            pieceWidth =
              widthPiece +
              (length - lengthHidden) * (widthPiece / lengthHidden);
          }
          if (length < lengthHidden) {
            pieceWidth =
              widthPiece -
              (lengthHidden - length) * (widthPiece / lengthHidden);
          }
        }
        if (data[`orientation${index}`] === "cross-horizontal") {
          if (length >= lengthHidden) {
            pieceLength =
              lengthPiece +
              (length - lengthHidden) * (lengthPiece / lengthHidden);
          }
          if (length < lengthHidden) {
            pieceLength =
              lengthPiece -
              (lengthHidden - length) * (lengthPiece / lengthHidden);
          }
          if (width >= widthHidden) {
            pieceWidth =
              widthPiece + (width - widthHidden) * (widthPiece / widthHidden);
          }
          if (width < widthHidden) {
            pieceWidth =
              widthPiece - (widthHidden - width) * (widthPiece / widthHidden);
          }
        }
        if (data[`orientation${index}`] === "side") {
          if (height >= heightHidden) {
            pieceLength =
              lengthPiece +
              (height - heightHidden) * (lengthPiece / heightHidden);
          }
          if (height < heightHidden) {
            pieceLength =
              lengthPiece -
              (heightHidden - height) * (lengthPiece / heightHidden);
          }
          if (width >= widthHidden) {
            pieceWidth =
              widthPiece + (width - widthHidden) * (widthPiece / widthHidden);
          }
          if (width < widthHidden) {
            pieceWidth =
              widthPiece - (widthHidden - width) * (widthPiece / widthHidden);
          }
        }
        //  parseFloat(pieceLength.toFixed(2));
        return {
          name: data[`namePiece${index}`],
          qty: qty,
          length: parseFloat(pieceLength.toFixed(2)),
          width: parseFloat(pieceWidth.toFixed(2)),
          orientation: data[`orientation${index}`],
          comment: data[`commentPiece${index}`],
          material: data[`materialPiece${index}`],
          lacqueredPiece: lacqueredPiece,
          lacqueredPieceSides: data[`lacqueredPieceSides${index}`],
          veneer: veneer,
          veneerFinishing: data[`veneerOption${index}`],
          veneerLacqueredPieceSides: data[`veneerLacqueredPieceSides${index}`],
          veneerLacqueredOpen: data[`veneerLacqueredOpen${index}`],
          veneer2: veneer2,
          veneer2Finishing: data[`veneer2Option${index}`],
          veneer2LacqueredPieceSides:
            data[`veneer2LacqueredPieceSides${index}`],
          veneer2LacqueredOpen: data[`veneer2LacqueredOpen${index}`],
          melamine: melamine,
          melamineLacquered: data[`melamineLacquered${index}`],
          melamineLacqueredPieceSides:
            data[`melamineLacqueredPieceSides${index}`],
          pantographed: data[`pantographed${index}`],
          edgeLength: data[`edgeLength${index}`],
          edgeLengthSides: data[`edgeLengthSides${index}`],
          edgeWidth: data[`edgeWidth${index}`],
          edgeWidthSides: data[`edgeWidthSides${index}`],
          lacqueredEdge: lacqueredEdge,
          polishedEdge: polishedEdge,
          loose_piece: data[`loose_piece${index}`],
        };
      });

      const updatedModule = {
        ...currentModule,
        name,
        length: parseInt(length),
        width: parseInt(width),
        height: parseInt(height),
        material,
        pieces_number: piecesNumber,
        supplies_module,
        pieces,
      };

      await updateModuleOfFurniture(idFurniture, idModule, updatedModule);
      console.log("¡Módulo actualizado con éxito!", updatedModule);
      //le pasamos al padre para que desrenderice el componente
      onModified();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTablesToSet();
    getAllSuppliesToSet();
    getFurnitureData(); // Llamar a la función para obtener los datos del mueble y módulo
    console.log(idModule);
  }, [idModule]);

  return (
    <div className="m-8">
      <div className="flex gap-4">
        <h1 className="text-4xl">Editar Módulo</h1>
        <button
          onClick={notModified}
          className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium"
        >
          Cerrar
        </button>
      </div>
      <form
        action=""
        className="flex flex-wrap w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-3/12 my-2">
          <label className="font-semibold mb-1" htmlFor="name">
            Nombre del módulo
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
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
        <div className="flex flex-col w-3/12 my-2">
          <label className="font-semibold mb-1" htmlFor="length">
            Largo
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
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
          {/* input hidden */}
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
            type="hidden"
            name="lengthHidden"
            id="lengthHidden"
            defaultValue={moduleOriginalLength}
            {...register("lengthHidden", {
              required: "El campo es obligatorio",
            })}
          />
        </div>
        <div className="flex flex-col w-3/12 my-2 ">
          <label className="font-semibold mb-1" htmlFor="height">
            Alto
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
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
          {/* input hidden */}
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
            type="hidden"
            name="heightHidden"
            id="heightHidden"
            defaultValue={moduleOriginalHeight}
            {...register("heightHidden", {
              required: "El campo es obligatorio",
            })}
          />
        </div>

        <div className="flex flex-col w-3/12 my-2">
          <label className="font-semibold mb-1" htmlFor="width">
            Profundidad
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
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
          {/* input hidden */}
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
            type="hidden"
            name="widthHidden"
            id="widthHidden"
            defaultValue={moduleOriginalWidth}
            {...register("widthHidden", {
              required: "El campo es obligatorio",
            })}
          />
        </div>
        <div className="flex flex-col w-3/12 my-2">
          <label className="font-semibold mb-1" htmlFor="material">
            Material
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-11/12"
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
          <label htmlFor="suppliesNumber" className="font-semibold mb-1">
            Cantidad de insumos
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-1/12"
            type="number"
            name="suppliesNumber"
            id="suppliesNumber"
            {...register("suppliesNumber")}
            value={suppliesCount}
            onChange={handleSuppliesCountChange}
            min="0"
          />
          {errors.suppliesNumber && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.suppliesNumber.message}
            </span>
          )}
        </div>

        {currentModule &&
          [...Array(suppliesCount)].map((_, index) => (
            <FormEditSupplies
              key={`supplies-${index}`}
              register={register}
              index={index}
              errors={errors}
              supplies={supplies}
              supplyModule={currentModule.supplies_module[index]}
              setValue={setValue} // Asegúrate de pasar setValue aquí también
            />
          ))}
        <h2 className="text-3xl">Piezas</h2>
        <div className="flex flex-col w-full my-2">
          <label htmlFor="piecesNumber" className="font-semibold mb-1">
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
            value={piecesCount}
            readOnly
          />
          {errors.piecesNumber && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors.piecesNumber.message}
            </span>
          )}
        </div>

        {currentModule &&
          [...Array(piecesCount)].map((_, index) => (
            <FormEditPieces
              key={`pieces-${index}`}
              register={register}
              index={index}
              errors={errors}
              tables={tables}
              resetField={resetField}
              setValue={setValue} // Pasa setValue aquí también
              piece={currentModule.pieces[index]}
            />
          ))}
        <div className="w-full">
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white px-4 rounded-md"
            type="submit"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export { EditFurnitureSingleModuleComponent };
