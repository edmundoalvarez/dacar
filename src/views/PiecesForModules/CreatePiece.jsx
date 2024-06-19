import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreatePiece } from "../../index.js";

function CreatePiece() {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      // Crear la pieza y obtener el ID de la pieza creada
      const { name, length, width, category, material, edge, module_id } = data; // Extraer datos relevantes para el módulo
      const moduleData = {
        name,
        length,
        width,
        material,
        edge,
        module_id,
      }; // Crear objeto pieceData con los datos de la pieza
      const pieceId = await createModule(pieceData);
      console.log("¡Creaste la pieza con éxito!");

      // Crear las piezas asociadas al módulo
      for (let i = 0; i < piecesCount; i++) {
        const pieceData = {
          // Mapeo de los nombres de los campos del formulario a los nombres esperados en la base de datos
          name: data[`namePiece${i}`],
          length: data[`lengthPiece${i}`],
          width: data[`widthPiece${i}`],
          category: data[`categoryPiece${i}`],
          material: data[`materialPiece${i}`],
          edge: data[`edgePiece${i}`],
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
          <label htmlFor="width">Ancho</label>
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
        <h2 className="text-3xl">Piezas</h2>
        {[...Array(piecesCount)].map((_, index) => (
          <FormCreatePieces
            key={index}
            register={register}
            index={index}
            errors={errors}
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
