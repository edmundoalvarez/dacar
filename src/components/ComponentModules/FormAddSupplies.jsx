import { useState } from "react";

function FormAddSupplies({ register, index, errors, supplies }) {
    const [selectedSupplyName, setSelectedSupplyName] = useState("");

    const handleSupplyChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedSupplyName(selectedOption.text);
    };

    return (
        <>
            <div className="flex gap-x-4 w-full border-2 border-emerald-600 rounded-lg p-10 mb-6">
                <div className="flex flex-col w-1/2 my-2">
                    <label
                        htmlFor={`supplie_id_name${index}`}
                        className="font-semibold mb-1"
                    >
                        Insumo
                    </label>
                    <select
                        className="border border-gray-300 rounded-md p-2"
                        name={`supplie_id_name${index}`}
                        id={`supplie_id_name${index}`}
                        {...register(`supplie_id_name${index}`, {
                            required: "El campo es obligatorio",
                        })}
                        onChange={handleSupplyChange}
                    >
                        <option value="">Elegir una opción</option>
                        {supplies.map((supplie) => (
                            <option
                                key={supplie._id}
                                value={`${supplie._id}##${supplie.name}`}
                            >
                                {supplie.name}
                            </option>
                        ))}
                    </select>
                    {errors[`supplie_id_name${index}`] && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors[`supplie_id_name${index}`].message}
                        </span>
                    )}
                </div>
                <div className="flex flex-col w-1/2 my-2">
                    <label
                        htmlFor={`supplie_qty${index}`}
                        className="font-semibold mb-1"
                    >
                        Cantidad
                    </label>
                    <input
                        className="border border-gray-300 rounded-md p-2"
                        type="number"
                        step="any"
                        name={`supplie_qty${index}`}
                        id={`supplie_qty${index}`}
                        {...register(`supplie_qty${index}`, {
                            required: "El campo es obligatorio",
                        })}
                    />
                    {errors[`supplie_qty${index}`] && (
                        <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
                            {errors[`supplie_qty${index}`].message}
                        </span>
                    )}
                </div>
                {/* <div className="flex flex-col w-2/12 my-2">
          <label
            htmlFor={`supplie_length${index}`}
            className="font-semibold mb-1"
          >
            Largo (opcional)
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name={`supplie_length${index}`}
            id={`supplie_length${index}`}
            {...register(`supplie_length${index}`)}
          />
          {errors[`supplie_length${index}`] && (
            <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
              {errors[`supplie_length${index}`].message}
            </span>
          )}
        </div> */}
            </div>
        </>
    );
}

export { FormAddSupplies };
