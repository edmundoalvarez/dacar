function FormCreateClient({ register, errors }) {
    return (
        <div className="px-6 py-6 mb-6 border-2 border-emerald-600 rounded-lg">
            <h3 className="mb-3 font-semibold text-2xl text-emerald-700 uppercase w-full">
                Datos Cliente
            </h3>

            <div className="flex flex-col w-full gap-4">
                <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="client_name" className="text-sm font-medium mb-1">Nombre</label>
                        <input
                            name="client_name"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`client_name`, {
                                required: "El campo es obligatorio",
                            })}
                        />
                        {errors[`client_name`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`client_name`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="client_lastname" className="text-sm font-medium mb-1">Apellido</label>
                        <input
                            name="client_lastname"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`client_lastname`, {
                                required: "El campo es obligatorio",
                            })}
                        />
                        {errors[`client_lastname`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`client_lastname`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="dni" className="text-sm font-medium mb-1">DNI</label>
                        <input
                            name="dni"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`dni`)}
                        />
                        {errors[`dni`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`dni`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="cuil_cuit" className="text-sm font-medium mb-1">CUIL/CUIT</label>
                        <input
                            name="cuil_cuit"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`cuil_cuit`)}
                        />
                        {errors[`cuil_cuit`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`cuil_cuit`].message}
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="address" className="text-sm font-medium mb-1">Dirección</label>
                        <input
                            name="address"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`address`)}
                        />
                        {errors[`address`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`address`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
                        <input
                            name="email"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`email`)}
                        />
                        {errors[`email`] && (
                            <span className="text-xs text-red-700 mt-1">
                                {errors[`email`].message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm font-medium mb-1">Teléfono</label>
                        <input
                            name="phone"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            {...register(`phone`)}
                        />
                        {errors[`phone`] && (
                            <span className="text-xs text-red-700 mt-1">
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
