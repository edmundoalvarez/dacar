function FormCreateClient({ register, errors }) {
    return (
        <div className="px-6 py-6 mb-6 border-2 border-emerald-600 rounded-lg ">
            <h3 className="mb-1 font-semibold text-2xl text-emerald-700 uppercase w-full">
                Datos Cliente
            </h3>

            <div className="flex flex-col w-full gap-4">
                <div className="flex flex-row gap-4 mt-2">
                    <div className="flex flex-col w-1/4 ">
                        {" "}
                        <label htmlFor={`client_name`}>Nombre</label>
                        <input
                            name={`client_name`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
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
                    <div className="flex flex-col w-1/4 ">
                        {" "}
                        <label htmlFor={`client_lastname`}>Apellido</label>
                        <input
                            name={`client_lastname`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
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
                    <div className="flex flex-col w-1/4 ">
                        {" "}
                        <label htmlFor={`dni`}>DNI</label>
                        <input
                            name={`dni`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            {...register(`dni`)}
                        />
                        {errors[`dni`] && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors[`dni`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/4 ">
                        {" "}
                        <label htmlFor={`cuit_cuil`}>CUIL/CUIT</label>
                        <input
                            name={`cuil_cuit`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            {...register(`cuil_cuit`)}
                        />
                        {errors[`cuil_cuit`] && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors[`cuil_cuit`].message}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-1/3 ">
                        {" "}
                        <label htmlFor={`address`}>Dirección</label>
                        <input
                            name={`address`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            {...register(`address`)}
                        />
                        {errors[`address`] && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors[`address`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/3 ">
                        {" "}
                        <label htmlFor={`email`}>Email</label>
                        <input
                            name={`email`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            {...register(`email`)}
                        />
                        {errors[`email`] && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors[`email`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col w-1/3 ">
                        {" "}
                        <label htmlFor={`phone`}>Teléfono</label>
                        <input
                            name={`phone`}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            {...register(`phone`)}
                        />
                        {errors[`phone`] && (
                            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                                {errors[`phone`].message}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export { FormCreateClient };
