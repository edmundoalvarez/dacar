import React, { useState } from "react";

function FormCreatePieces({ register, index, errors, tables }) {
  const [showEdgePiece, setShowEdgePiece] = useState(false);
  const [finishingModule, setFinishingModule] = useState("");
  const handleEdgeOptionChange = (event) => {
    setShowEdgePiece(event.target.value === "yes");
  };
  //obtener la opcion del select de laqueado/enchapado
  const handleFinishingOptionChange = (event) => {
    setFinishingModule(event.target.value);
  };
  return (
    <>
      <div className="flex flex-wrap gap-x-4 w-full">
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
        <div className="flex flex-col w-2/12 my-2">
          <label htmlFor={`lengthPiece${index}`}>Largo</label>
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
        <div className="flex flex-col w-2/12 my-2">
          <label htmlFor={`widthPiece${index}`}>Ancho</label>
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
              <option key={table.id} value={table.id}>
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
        <div className="flex flex-col w-2/12 my-2">
          <label htmlFor={`orientation${index}`}>Orientación</label>
          <select
            className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
            name={`orientation${index}`}
            id={`orientation${index}`}
            {...register(`orientation${index}`, {
              required: "El campo es obligatorio",
            })}
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
        <div className="flex flex-col w-3/12 my-2">
          <label htmlFor={`lacqueredOrVeneer`}>
            Laqueado/Enchapado (opcional)
          </label>
          <select
            className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
            name={`finishing${index}`}
            id={`finishing${index}`}
            {...register(`finishing${index}`)}
            onChange={handleFinishingOptionChange}
          >
            <option value="">Elegir una opción</option>
            <option value="lacquered">Laqueado</option>
            <option value="veneer">Enchapado</option>
          </select>
          {errors[`finishing${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`finishing${index}`].message}
            </span>
          )}
        </div>
        {/* Condicional para mostrar elementos dependiendo de `finishingModule` */}
        {finishingModule === "lacquered" && (
          <div className="flex flex-col w-2/12 my-2">
            <label htmlFor={`lacqueredPiece${index}`}>
              Laqueado (opcional)
            </label>
            <select
              className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
              name={`lacqueredPiece${index}`}
              id={`lacqueredPiece${index}`}
              {...register(`lacqueredPiece${index}`)}
            >
              <option value="">Elegir una opción</option>
              <option value="single">1 Lado</option>
              <option value="double">2 Lados</option>
            </select>
            {errors[`lacqueredPiece${index}`] && (
              <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                {errors[`lacqueredPiece${index}`].message}
              </span>
            )}
          </div>
        )}
        {finishingModule === "veneer" && (
          <div className="flex flex-col w-2/12 my-2">
            <label>
              <input type="checkbox" {...register(`veneer${index}`)} />
              Enchapado
            </label>
          </div>
        )}
        <div className="flex flex-col w-2/12 my-2">
          <label>
            <input type="checkbox" {...register(`pantographed${index}`)} />
            Pantografiado
          </label>
        </div>
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
          <div>
            <div className="flex flex-col w-2/12 my-2">
              <label htmlFor={`edgeLength${index}`}>Filo</label>
              <input
                className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
                type="text"
                name={`edgeLength${index}`}
                id={`edgeLength${index}`}
                {...register(`edgeLength${index}`, {
                  required: "El campo es obligatorio",
                })}
              />
              {errors[`edgeLength${index}`] && (
                <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                  {errors[`edgeLength${index}`].message}
                </span>
              )}
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
    </>
  );
}

export { FormCreatePieces };
