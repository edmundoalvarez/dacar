import React, { useState } from "react";

function FormCreatePieces({ register, index, errors, tables, resetField }) {
  const [showEdgePiece, setShowEdgePiece] = useState(false);
  const [finishingModule, setFinishingModule] = useState("");
  const [lengthLabel, setLengthLabel] = useState("");
  const [widthLabel, setWidthLabel] = useState("");

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

  return (
    <div className="flex flex-wrap gap-x-4 w-full border-t-2 border-gray-400 pb-4">
      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`namePiece${index}`}>Nombre de la pieza</label>
        <input
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          type="text"
          name={`namePiece${index}`}
          id={`namePiece${index}`}
          {...register(`namePiece${index}`, {
            required: "El campo es obligatorio",
          })}
        />
        {errors[`namePiece${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`namePiece${index}`].message}
          </span>
        )}
      </div>
      <div className="flex flex-col w-1/12 my-2">
        <label>Pieza suelta</label>
        <input type="checkbox" {...register(`loose_piece${index}`)} />
      </div>
      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`orientation${index}`}>Orientación</label>
        <select
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          name={`orientation${index}`}
          id={`orientation${index}`}
          {...register(`orientation${index}`, {
            required: "El campo es obligatorio",
          })}
          onChange={handleOrientationOptionChange}
        >
          <option value="">Elegir una opción</option>
          <option value="cross-vertical">Transversal Vertical</option>
          <option value="cross-horizontal">Transversal Horizontal</option>
          <option value="side">Lateral</option>
        </select>
        {errors[`orientation${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`orientation${index}`].message}
          </span>
        )}
      </div>
      {lengthLabel !== "" && (
        <>
          {/* Length de la pieza */}
          <div className="flex flex-col w-2/12 my-2">
            <label htmlFor={`lengthPiece${index}`}>{lengthLabel}</label>
            <input
              className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
              type="text"
              name={`lengthPiece${index}`}
              id={`lengthPiece${index}`}
              {...register(`lengthPiece${index}`, {
                required: "El campo es obligatorio",
              })}
            />
            {errors[`lengthPiece${index}`] && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors[`lengthPiece${index}`].message}
              </span>
            )}
          </div>

          {/* Width de la pieza */}
          <div className="flex flex-col w-2/12 my-2">
            <label htmlFor={`widthPiece${index}`}>{widthLabel}</label>
            <input
              className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
              type="text"
              name={`widthPiece${index}`}
              id={`widthPiece${index}`}
              {...register(`widthPiece${index}`, {
                required: "El campo es obligatorio",
              })}
            />
            {errors[`widthPiece${index}`] && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors[`widthPiece${index}`].message}
              </span>
            )}
          </div>
        </>
      )}
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
        <label htmlFor={`lacqueredOrVeneer`}>Acabado</label>
        <select
          className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
          name={`finishing${index}`}
          id={`finishing${index}`}
          {...register(`finishing${index}`, {
            required: "El campo es obligatorio",
          })}
          onChange={handleFinishingOptionChange}
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
              <input type="checkbox" {...register(`pantographed${index}`)} />
              Pantografiado
            </label>
          </div>
        </div>
      )}
      {finishingModule === "melamine" && (
        <div className="flex flex-col w-2/12 my-2">
          <label>
            <input type="checkbox" {...register(`melamineLacquered${index}`)} />
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
            />
            <label htmlFor={`veneerOption${index}`} className="ml-2">
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
                Filo de {lengthLabel}
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
                Filo de {widthLabel}
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
          <div className="flex flex-col w-2/12 ml-4">
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

export { FormCreatePieces };
