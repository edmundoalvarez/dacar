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
  const [lengthLabel, setLengthLabel] = useState("");
  const [widthLabel, setWidthLabel] = useState("");

  useEffect(() => {
    // console.log("Pieza: ", piece);
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

  //CAMBIAR DE ORIENTACIÓN
  const handleOrientationOptionChange = (option) => {
    const optionSelected = option.target.value;
    if (optionSelected === "") {
      setLengthLabel("");
      setWidthLabel("");
    }
    if (optionSelected === "cross-vertical") {
      setLengthLabel("Alto");
      setWidthLabel("Largo");
    }
    if (optionSelected === "cross-horizontal") {
      setLengthLabel("Largo");
      setWidthLabel("Profundidad");
    }
    if (optionSelected === "side") {
      setLengthLabel("Alto");
      setWidthLabel("Profundidad");
    }
    alert(
      "Ha cambiado la orientación de la pieza, debe ajustar las medidas a los nuevos parametros de Alto, Largo o Profundidad"
    );
  };

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
    <div className="flex flex-wrap gap-x-4 w-full border-b-2 border-gray-300 pb-4 mb-4">
      <div className="flex flex-col w-1/5">
        {/* input hidden */}
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-11/12"
          type="hidden"
          name="pieceId"
          id="pieceId"
          defaultValue={piece?._id}
          {...register("pieceId")}
        />
        <label htmlFor={`namePiece${index}`} className="font-semibold mb-1">
          Nombre de la pieza
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
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
      <div className="flex flex-col w-1/12">
        <label htmlFor={`qty${index}`} className="font-semibold mb-1">
          Cantidad
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="number"
          name={`qty${index}`}
          id={`qty${index}`}
          {...register(`qty${index}`)}
        />
        {errors[`qty${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`qty${index}`].message}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center w-1/12">
        <label className="font-semibold mb-1 mr-2">Pieza suelta</label>
        <input
          type="checkbox"
          defaultChecked={piece?.loose_piece || false}
          {...register(`loose_piece${index}`)}
        />
      </div>
      <div className="flex flex-col w-1/5 mb-2">
        <label htmlFor={`orientation${index}`} className="font-semibold mb-1">
          Orientación
        </label>
        <select
          className="border border-gray-300 rounded-md p-2"
          name={`orientation${index}`}
          id={`orientation${index}`}
          {...register(`orientation${index}`, {
            required: "El campo es obligatorio",
          })}
          onChange={handleOrientationOptionChange}
        >
          <option value="cross-vertical">Transversal Vertical</option>
          <option value="cross-horizontal">Transversal Horizontal</option>
          <option value="side">Lateral</option>
        </select>
      </div>
      {/* length */}

      <div className="flex flex-col w-1/5">
        <label htmlFor={`lengthPiece${index}`} className="font-semibold mb-1">
          {lengthLabel ||
            (piece.orientation === "cross-vertical"
              ? "Alto"
              : piece.orientation === "cross-horizontal"
              ? "Largo"
              : piece.orientation === "side"
              ? "Alto"
              : "")}
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
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

      <div className="flex flex-col w-1/5">
        <label htmlFor={`widthPiece${index}`} className="font-semibold mb-1">
          {widthLabel ||
            (piece.orientation === "cross-vertical"
              ? "Largo"
              : piece.orientation === "cross-horizontal"
              ? "Profundidad"
              : piece.orientation === "side"
              ? "Profundidad"
              : "")}
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
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

      <div className="flex flex-col w-1/5">
        <label htmlFor={`categoryPiece${index}`}>Categoría</label>
        <input
          className="border border-gray-300 rounded-md p-2"
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
      <div className="flex flex-col w-1/5">
        <label htmlFor={`materialPiece${index}`} className="font-semibold mb-1">
          Material
        </label>
        <select
          className="border border-gray-300 rounded-md p-2"
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

      <div className="flex flex-col w-1/4">
        <label
          htmlFor={`lacqueredOrVeneer${index}`}
          className="font-semibold mb-1"
        >
          Acabado
        </label>
        <select
          className="border border-gray-300 rounded-md p-2"
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
        <div className="flex flex-col w-1/5">
          <label
            htmlFor={`lacqueredPieceSides${index}`}
            className="font-semibold mb-1"
          >
            Laqueado (opcional)
          </label>
          <select
            className="border border-gray-300 rounded-md p-2"
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
          <div className="flex items-center mt-2">
            <label className="font-semibold">Pantografiado</label>
            <input
              className="ml-2"
              type="checkbox"
              {...register(`pantographed${index}`)}
              defaultChecked={piece?.pantographed || false}
            />
          </div>
        </div>
      )}
      {finishingModule === "melamine" && (
        <div className="flex items-center mt-5 w-1/5">
          <label className="font-semibold mb-1">Laqueado</label>
          <input
            className="ml-2"
            type="checkbox"
            {...register(`melamineLacquered${index}`)}
            defaultChecked={piece?.melamineLacquered || false}
          />
        </div>
      )}
      {finishingModule === "veneer" && (
        <div className="flex flex-col w-1/5 mt-5">
          <div>
            <input
              className="border border-gray-300 rounded-md p-2"
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

      <div className="flex flex-col w-2/12 mt-4">
        <label className="font-semibold mb-1">¿Tiene filo?</label>
        <div className="flex gap-4">
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
        </div>
        {errors[`edgeOption${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`edgeOption${index}`].message}
          </span>
        )}
      </div>
      {showEdgePiece && (
        <div className="flex mt-4 gap-8">
          {/* filo length */}
          <div>
            <div>
              <label className="font-semibold mb-1">
                Filo de{" "}
                {lengthLabel ||
                  (piece.orientation === "cross-vertical"
                    ? "Alto:"
                    : piece.orientation === "cross-horizontal"
                    ? "Largo:"
                    : piece.orientation === "side"
                    ? "Alto:"
                    : "")}
              </label>
              <input
                className="ml-2"
                type="checkbox"
                {...register(`edgeLength${index}`)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`edgeLengthSides${index}`}
                className="font-semibold mb-1"
              >
                Cantidad de lados
              </label>
              <select
                className="border border-gray-300 rounded-md p-2"
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
          </div>
          <div>
            {/* filo width */}
            <div>
              <label className="font-semibold mb-1">
                Filo de{" "}
                {widthLabel ||
                  (piece.orientation === "cross-vertical"
                    ? "Largo:"
                    : piece.orientation === "cross-horizontal"
                    ? "Profundidad:"
                    : piece.orientation === "side"
                    ? "Profundidad:"
                    : "")}
              </label>
              <input
                className="ml-2"
                type="checkbox"
                {...register(`edgeWidth${index}`)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`edgeWidthSides${index}`}
                className="font-semibold mb-1"
              >
                Cantidad de lados
              </label>
              <select
                className="border border-gray-300 rounded-md p-2"
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
            </div>
            {/* filo laqueado */}
          </div>
          <div className="flex flex-col ml-4">
            <label className="font-semibold mb-1">Filo Laqueado</label>
            <input type="checkbox" {...register(`lacqueredEdge${index}`)} />
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
