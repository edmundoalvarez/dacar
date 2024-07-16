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
  idForniture,
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
    if (!idForniture) {
      console.error("idForniture is undefined");
      return;
    }

    getFurnitureById(idForniture)
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
          setValue(`lengthPiece${index}`, piece.length.toString());
          setValue(`widthPiece${index}`, piece.width.toString());
          setValue(`numeratorLength${index}`, piece.numeratorLength);
          setValue(`denominatorLength${index}`, piece.denominatorLength);
          setValue(`numeratorWidth${index}`, piece.numeratorWidth);
          setValue(`denominatorWidth${index}`, piece.denominatorWidth);
          setValue(`orientation${index}`, piece.orientation);
          setValue(`categoryPiece${index}`, piece.category);
          setValue(`materialPiece${index}`, piece.material);
          setValue(`lacqueredPiece${index}`, piece.lacqueredPiece);
          setValue(`lacqueredPieceSides${index}`, piece.lacqueredPieceSides);
          setValue(`veneer${index}`, piece.veneer);
          setValue(`veneerOption${index}`, piece.veneerFinishing);
          setValue(`melamine${index}`, piece.melamine);
          setValue(`melamineLacquered${index}`, piece.melamineLacquered);
          setValue(`pantographed${index}`, piece.pantographed);
          setValue(`edgeLength${index}`, piece.edgeLength);
          setValue(`edgeLengthSides${index}`, piece.edgeLengthSides);
          setValue(`edgeWidth${index}`, piece.edgeWidth);
          setValue(`edgeWidthSides${index}`, piece.edgeWidthSides);
          setValue(`lacqueredEdge${index}`, piece.lacqueredEdge);
          console.log("piece", `edgeLength${index}`, piece.edgeLength);
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
        category,
        piecesNumber,
      } = data;

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

      const pieces = [...Array(piecesCount)].map((_, index) => {
        let lacqueredPiece;
        let veneer;
        let melamine;
        if (data[`finishing${index}`] === "lacqueredPiece") {
          lacqueredPiece = true;
          veneer = false;
          melamine = false;
        }
        if (data[`finishing${index}`] === "veneer") {
          lacqueredPiece = false;
          veneer = true;
          melamine = false;
        }
        if (data[`finishing${index}`] === "melamine") {
          lacqueredPiece = false;
          veneer = false;
          melamine = true;
        }

        //lo que viene de la pieza
        let fractionLength =
          parseInt(data[`numeratorLength${index}`]) /
          parseInt(data[`denominatorLength${index}`]);
        fractionLength = parseFloat(fractionLength.toFixed(2));

        let fractionWidth =
          parseInt(data[`numeratorWidth${index}`]) /
          parseInt(data[`denominatorWidth${index}`]);
        fractionWidth = parseFloat(fractionWidth.toFixed(2));

        let lengthPiece = parseFloat(data[`lengthPiece${index}`]);
        let widthPiece = parseFloat(data[`widthPiece${index}`]);
        //variables para cargar el dato
        let pieceLength;
        let pieceWidth;
        if (data[`orientation${index}`] === "cross-vertical") {
          if (height >= heightHidden) {
            pieceLength =
              lengthPiece + (height - heightHidden) * fractionLength;
          }
          if (height < heightHidden) {
            pieceLength =
              lengthPiece - (heightHidden - height) * fractionLength;
          }

          if (length >= lengthHidden) {
            pieceWidth = widthPiece + (length - lengthHidden) * fractionWidth;
          }
          if (length < lengthHidden) {
            pieceWidth = widthPiece - (lengthHidden - length) * fractionWidth;
          }
        }
        if (data[`orientation${index}`] === "cross-horizontal") {
          if (length >= lengthHidden) {
            pieceLength =
              lengthPiece + (length - lengthHidden) * fractionLength;
          }
          if (length < lengthHidden) {
            pieceLength =
              lengthPiece - (lengthHidden - length) * fractionLength;
          }
          if (width >= widthHidden) {
            pieceWidth = widthPiece + (width - widthHidden) * fractionWidth;
          }
          if (width < widthHidden) {
            pieceWidth = widthPiece - (widthHidden - width) * fractionWidth;
          }
        }
        if (data[`orientation${index}`] === "side") {
          if (height >= heightHidden) {
            pieceLength =
              lengthPiece + (height - heightHidden) * fractionLength;
          }
          if (height < heightHidden) {
            pieceLength =
              lengthPiece - (heightHidden - height) * fractionLength;
          }
          if (width >= widthHidden) {
            pieceWidth = widthPiece + (width - widthHidden) * fractionWidth;
          }
          if (width < widthHidden) {
            pieceWidth = widthPiece - (widthHidden - width) * fractionWidth;
          }
        }
        return {
          name: data[`namePiece${index}`],
          length: pieceLength,
          width: pieceWidth,
          numeratorLength: data[`numeratorLength${index}`],
          denominatorLength: data[`denominatorLength${index}`],
          numeratorWidth: data[`numeratorWidth${index}`],
          denominatorWidth: data[`denominatorWidth${index}`],
          orientation: data[`orientation${index}`],
          category: data[`categoryPiece${index}`],
          material: data[`materialPiece${index}`],
          lacqueredPiece: lacqueredPiece,
          lacqueredPieceSides: data[`lacqueredPieceSides${index}`],
          veneer: veneer,
          veneerFinishing: data[`veneerOption${index}`],
          melamine: melamine,
          melamineLacquered: data[`melamineLacquered${index}`],
          pantographed: data[`pantographed${index}`],
          edgeLength: data[`edgeLength${index}`],
          edgeLengthSides: data[`edgeLengthSides${index}`],
          edgeWidth: data[`edgeWidth${index}`],
          edgeWidthSides: data[`edgeWidthSides${index}`],
          lacqueredEdge: data[`lacqueredEdge${index}`],
        };
      });

      const updatedModule = {
        ...currentModule,
        name,
        length,
        width,
        height,
        category,
        pieces_number: piecesNumber,
        supplies_module,
        pieces,
      };

      await updateModuleOfFurniture(idForniture, idModule, updatedModule);
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
    <div className="m-4">
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
          {/* input hidden */}
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
          {/* input hidden */}
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
            type="hidden"
            name="lengthHidden"
            id="lengthHidden"
            defaultValue={moduleOriginalLength}
            {...register("lengthHidden", {
              required: "El campo es obligatorio",
            })}
          />
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
          {/* input hidden */}
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
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
            value={suppliesCount}
            onChange={handleSuppliesCountChange}
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
          <label htmlFor="piecesNumber">Cantidad de piezas</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-3/12"
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