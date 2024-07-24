import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function FormEditPieces({
  register,
  index,
  errors,
  tables,
  resetField,
  setValue,
  piece,
}) {
  const [showEdgePiece, setShowEdgePiece] = useState(false);
  const [finishingModule, setFinishingModule] = useState("");
  const [material, setMaterial] = useState("");

  useEffect(() => {
    if (piece) {
      if (piece.edgeLength || piece.edgeWidth) {
        setShowEdgePiece(true);
      }
      const initialFinishing = piece.veneer
        ? "veneer"
        : piece.melamine
        ? "melamine"
        : piece.lacqueredPiece
        ? "lacqueredPiece"
        : "";

      setFinishingModule(initialFinishing);
      setValue(`finishing${index}`, initialFinishing);

      setMaterial(piece.material || "");
      setValue(`materialPiece${index}`, piece.material || "");
    }
  }, [piece, setValue, index]);

  const handleEdgeOptionChange = (event) => {
    const isYes = event.target.value === "yes";
    setShowEdgePiece(isYes);

    if (!isYes) {
      resetField(`edgeLength${index}`);
      resetField(`edgeLengthSides${index}`);
      resetField(`edgeWidth${index}`);
      resetField(`edgeWidthSides${index}`);
      resetField(`lacqueredEdge${index}`);
    }
  };

  const handleFinishingOptionChange = (event) => {
    const selectedFinishing = event.target.value;
    setFinishingModule(selectedFinishing);

    // Reset fields based on finishing module change
    if (selectedFinishing !== "lacqueredPiece") {
      resetField(`lacqueredPieceSides${index}`);
      resetField(`pantographed${index}`);
    }
    if (selectedFinishing !== "melamine") {
      resetField(`melamineLacquered${index}`);
    }
    if (selectedFinishing !== "veneer") {
      resetField(`veneerOption${index}`);
    }
  };

  const handleMaterialChange = (event) => {
    const selectedMaterial = event.target.value;
    setMaterial(selectedMaterial);
    setValue(`materialPiece${index}`, selectedMaterial);
  };

  return (
    <div className="flex flex-wrap gap-x-4 w-full">
      <div className="flex flex-col w-2/12 my-2">
        {/* input hidden */}
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
          type="hidden"
          name="pieceId"
          id="pieceId"
          defaultValue={piece?._id}
          {...register("pieceId", {
            required: "El campo es obligatorio",
          })}
        />
        <label htmlFor={`namePiece${index}`}>Nombre de la pieza</label>
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          type="text"
          name={`namePiece${index}`}
          id={`namePiece${index}`}
          {...register(`namePiece${index}`, {
            required: "El campo es obligatorio",
          })}
          defaultValue={piece?.name || ""}
        />
        {errors[`namePiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`namePiece${index}`].message}
          </span>
        )}
      </div>
      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`orientation${index}`}>Orientación</label>
        <input
          type="hidden"
          name={`orientation${index}`}
          id={`orientation${index}`}
          defaultValue={piece?.orientation || ""}
          {...register(`orientation${index}`)}
        />
        <input
          type="text"
          className="border-solid border-2 bg-gray-300 border-opacity mb-2 rounded-md w-full"
          name={`orientationShow${index}`}
          id={`orientationShow${index}`}
          value={
            piece.orientation === "cross-vertical"
              ? "Transversal Vertical"
              : piece.orientation === "cross-horizontal"
              ? "Transversal Horizontal"
              : piece.orientation === "side"
              ? "Lateral"
              : ""
          }
          disabled
        />
      </div>
      {/* length */}

      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`lengthPiece${index}`}>
          {piece.orientation === "cross-vertical"
            ? "Alto:"
            : piece.orientation === "cross-horizontal"
            ? "Largo:"
            : piece.orientation === "side"
            ? "Alto:"
            : ""}
        </label>
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          type="text"
          name={`lengthPiece${index}`}
          id={`lengthPiece${index}`}
          {...register(`lengthPiece${index}`, {
            required: "El campo es obligatorio",
          })}
          defaultValue={piece?.length.toString() || ""}
        />
        {errors[`lengthPiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`lengthPiece${index}`].message}
          </span>
        )}
      </div>

      {/* width */}

      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`widthPiece${index}`}>
          {" "}
          {piece.orientation === "cross-vertical"
            ? "Largo:"
            : piece.orientation === "cross-horizontal"
            ? "Profundidad:"
            : piece.orientation === "side"
            ? "Profundidad:"
            : ""}
        </label>
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          type="text"
          name={`widthPiece${index}`}
          id={`widthPiece${index}`}
          {...register(`widthPiece${index}`, {
            required: "El campo es obligatorio",
          })}
          defaultValue={piece?.width.toString() || ""}
        />
        {errors[`widthPiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`widthPiece${index}`].message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`categoryPiece${index}`}>Categoría</label>
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          type="text"
          name={`categoryPiece${index}`}
          id={`categoryPiece${index}`}
          {...register(`categoryPiece${index}`, {
            required: "El campo es obligatorio",
          })}
          defaultValue={piece?.category || ""}
        />
        {errors[`categoryPiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`categoryPiece${index}`].message}
          </span>
        )}
      </div>
      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`materialPiece${index}`}>Material</label>
        <select
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          name={`materialPiece${index}`}
          id={`materialPiece${index}`}
          {...register(`materialPiece${index}`, {
            required: "El campo es obligatorio",
          })}
          onChange={handleMaterialChange}
          value={material} // Usar solo value para un componente controlado
        >
          <option value="">Elegir una opción</option>
          {tables.map((table) => (
            <option key={table._id} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
        {errors[`materialPiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`materialPiece${index}`].message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-3/12 my-2">
        <label htmlFor={`lacqueredOrVeneer${index}`}>Acabado</label>
        <select
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          name={`finishing${index}`}
          id={`lacqueredOrVeneer${index}`}
          {...register(`finishing${index}`, {
            required: "El campo es obligatorio",
          })}
          onChange={handleFinishingOptionChange}
          value={finishingModule} // Usar solo value para un componente controlado
        >
          <option value="">Elegir una opción</option>
          <option value="lacqueredPiece">Laqueado</option>
          <option value="veneer">Enchapado</option>
          <option value="melamine">Melamina</option>
        </select>
        {errors[`finishing${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`finishing${index}`].message}
          </span>
        )}
      </div>
      {/* Condicional para mostrar elementos dependiendo de `finishingModule` */}
      {finishingModule === "lacqueredPiece" && (
        <div className="flex flex-col w-2/12 my-2">
          <label htmlFor={`lacqueredPieceSides${index}`}>
            Laqueado (opcional)
          </label>
          <select
            className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
            name={`lacqueredPieceSides${index}`}
            id={`lacqueredPieceSides${index}`}
            {...register(`lacqueredPieceSides${index}`, {
              required: "El campo es obligatorio",
            })}
            defaultValue={piece?.lacqueredPieceSides || ""}
          >
            <option value="">Elegir una opción</option>
            <option value="single">1 Lado</option>
            <option value="double">2 Lados</option>
          </select>
          {errors[`lacqueredPieceSides${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`lacqueredPieceSides${index}`].message}
            </span>
          )}
          <div className="flex flex-col w-2/12 my-2">
            <label>
              <input
                type="checkbox"
                {...register(`pantographed${index}`)}
                defaultChecked={piece?.pantographed || false}
              />
              Pantografiado
            </label>
          </div>
        </div>
      )}
      {finishingModule === "melamine" && (
        <div className="flex flex-col w-2/12 my-2">
          <label>
            <input
              type="checkbox"
              {...register(`melamineLacquered${index}`)}
              defaultChecked={piece?.melamineLacquered || false}
            />
            Laqueado
          </label>
        </div>
      )}
      {finishingModule === "veneer" && (
        <div className="flex flex-col w-2/12 my-2">
          <div>
            <input
              {...register(`veneerOption${index}`, {
                required: "Este campo es requerido",
              })}
              type="radio"
              id={`veneerLacquered${index}`}
              name={`veneerOption${index}`}
              value="veneerLacquered"
              defaultChecked={piece?.veneerFinishing === "veneerLacquered"}
            />
            <label htmlFor={`veneerLacquered${index}`} className="ml-2">
              Laqueado
            </label>
          </div>
          <div>
            <input
              {...register(`veneerOption${index}`, {
                required: "Este campo es requerido",
              })}
              type="radio"
              id={`veneerPolished${index}`}
              name={`veneerOption${index}`}
              value="veneerPolished"
              defaultChecked={piece?.veneerFinishing === "veneerPolished"}
            />
            <label htmlFor={`veneerPolished${index}`} className="ml-2">
              Lustrado
            </label>
          </div>
          {errors[`veneerOption${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`veneerOption${index}`].message}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col w-2/12 my-2">
        <label>¿Tiene filo?</label>
        <div>
          <input
            type="radio"
            id={`edgeOptionYes${index}`}
            name={`edgeOption${index}`}
            value="yes"
            onChange={handleEdgeOptionChange}
            defaultChecked={piece.edgeLength || piece.edgeWidth}
          />
          <label htmlFor={`edgeOptionYes${index}`} className="ml-2">
            Sí
          </label>
        </div>
        <div>
          <input
            type="radio"
            id={`edgeOptionNo${index}`}
            name={`edgeOption${index}`}
            value="no"
            onChange={handleEdgeOptionChange}
            defaultChecked={!piece.edgeLength && !piece.edgeWidth}
          />
          <label htmlFor={`edgeOptionNo${index}`} className="ml-2">
            No
          </label>
        </div>
        {errors[`edgeOption${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`edgeOption${index}`].message}
          </span>
        )}
      </div>
      {showEdgePiece && (
        <div className="flex">
          {/* filo length */}
          <div>
            <div>
              <label>
                <input type="checkbox" {...register(`edgeLength${index}`)} />
                Filo de{" "}
                {piece.orientation === "cross-vertical"
                  ? "Alto:"
                  : piece.orientation === "cross-horizontal"
                  ? "Largo:"
                  : piece.orientation === "side"
                  ? "Alto:"
                  : ""}
              </label>
            </div>
            <label htmlFor={`edgeLengthSides${index}`}>Cantidad de lados</label>
            <select
              className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
              name={`edgeLengthSides${index}`}
              id={`edgeLengthSides${index}`}
              {...register(`edgeLengthSides${index}`)}
            >
              <option value="">Elegir una opción</option>
              <option value="1">1 Lado</option>
              <option value="2">2 Lados</option>
            </select>
            {errors[`edgeLengthSides${index}`] && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors[`edgeLengthSides${index}`].message}
              </span>
            )}
          </div>
          <div>
            {/* filo width */}
            <div>
              <label>
                <input type="checkbox" {...register(`edgeWidth${index}`)} />
                Filo de{" "}
                {piece.orientation === "cross-vertical"
                  ? "Largo:"
                  : piece.orientation === "cross-horizontal"
                  ? "Profundidad:"
                  : piece.orientation === "side"
                  ? "Profundidad:"
                  : ""}
              </label>
            </div>
            <label htmlFor={`edgeWidthSides${index}`}>Cantidad de lados</label>
            <select
              className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
              name={`edgeWidthSides${index}`}
              id={`edgeWidthSides${index}`}
              {...register(`edgeWidthSides${index}`)}
            >
              <option value="">Elegir una opción</option>
              <option value="1">1 Lado</option>
              <option value="2">2 Lados</option>
            </select>
            {errors[`edgeWidthSides${index}`] && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors[`edgeWidthSides${index}`].message}
              </span>
            )}
            {/* filo laqueado */}
          </div>
          <div className="flex flex-col w-2/12 my-2">
            <label>
              <input type="checkbox" {...register(`lacqueredEdge${index}`)} />
              Filo Laqueado
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

FormEditPieces.propTypes = {
  register: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  tables: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  resetField: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  piece: PropTypes.shape({
    name: PropTypes.string,
    length: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    numeratorLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denominatorLength: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    numeratorWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    denominatorWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    material: PropTypes.string,
    orientation: PropTypes.string,
    lacqueredPiece: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    lacqueredPieceSides: PropTypes.string,
    veneer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    veneerFinishing: PropTypes.string,
    melamine: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    melamineLacquered: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    pantographed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    edgeLength: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    edgeLengthSides: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    edgeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    edgeWidthSides: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lacqueredEdge: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
};

export { FormEditPieces };
