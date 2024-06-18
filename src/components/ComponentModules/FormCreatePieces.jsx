import React from "react";

function FormCreatePieces({ register, index, errors }) {
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
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
            type="text"
            name={`materialPiece${index}`}
            id={`materialPiece${index}`}
            {...register(`materialPiece${index}`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`materialPiece${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`materialPiece${index}`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-2/12 my-2">
          <label htmlFor={`edgePiece${index}`}>Filo</label>
          <input
            className="border-solid border-2 border-opacity mb-2 rounded-md w-full"
            type="text"
            name={`edgePiece${index}`}
            id={`edgePiece${index}`}
            {...register(`edgePiece${index}`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`edgePiece${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`edgePiece${index}`].message}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export { FormCreatePieces };
