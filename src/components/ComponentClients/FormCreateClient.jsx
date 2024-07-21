function FormCreateClient({ register, errors }) {
  return (
    <>
      <h3 className="text-2xl font-semibold mb-2">Datos Cliente</h3>
      <div className="flex flex-wrap w-full my-2  gap-4">
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`client_name`}>Nombre</label>
          <input
            name={`client_name`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`client_name`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`client_name`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`client_name`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`client_lastname`}>Apellido</label>
          <input
            name={`client_lastname`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`client_lastname`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`client_lastname`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`client_lastname`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`dni`}>DNI</label>
          <input
            name={`dni`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`dni`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`dni`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`dni`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`cuit_cuil`}>CUIL/CUIT</label>
          <input
            name={`cuil_cuit`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`cuil_cuit`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`cuil_cuit`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`cuil_cuit`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`address`}>Dirección</label>
          <input
            name={`address`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`address`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`address`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`address`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`email`}>Email</label>
          <input
            name={`email`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`email`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`email`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`email`].message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-1/4 my-2 ">
          {" "}
          <label htmlFor={`phone`}>Teléfono</label>
          <input
            name={`phone`}
            type="text"
            className="border-solid border-2 border-opacity mb-2 rounded-md "
            {...register(`phone`, {
              required: "El campo es obligatorio",
            })}
          />
          {errors[`phone`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`phone`].message}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
export { FormCreateClient };
