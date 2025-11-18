import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function FormEditSupplies({
  register,
  index,
  errors,
  supplies,
  supplyModule,
  setValue,
}) {
  const [selectedSupply, setSelectedSupply] = useState("");

  useEffect(() => {
    if (supplyModule) {
      const id = supplyModule.supplie_id || "";
      setSelectedSupply(id);
      setValue(`supplie_id${index}`, id);
      setValue(`supplie_qty${index}`, supplyModule.supplie_qty);
      setValue(`supplie_length${index}`, supplyModule.supplie_length);
    }
  }, [supplyModule, index, setValue]);

  const handleSupplyChange = (event) => {
    const value = event.target.value;
    setSelectedSupply(value);
    setValue(`supplie_id${index}`, value);
  };

  return (
    <div className="flex gap-x-4 w-full border-2 border-emerald-600 rounded-lg p-10 mb-6">
      <div className="flex flex-col w-1/2 my-2">
        <label htmlFor={`supplie_id${index}`} className="font-semibold mb-1">
          Insumo
        </label>
        <select
          className="border border-gray-300 rounded-md p-2"
          name={`supplie_id${index}`}
          id={`supplie_id${index}`}
          {...register(`supplie_id${index}`, {
            required: "El campo es obligatorio",
          })}
          value={selectedSupply}
          onChange={handleSupplyChange}
        >
          <option value="">Elegir una opción</option>
          {supplies.map((supplie) => (
            <option key={supplie._id} value={supplie._id}>
              {supplie.name}
            </option>
          ))}
        </select>
        {errors[`supplie_id${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`supplie_id${index}`].message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-1/2 my-2">
        <label htmlFor={`supplie_qty${index}`} className="font-semibold mb-1">
          Cantidad
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="number"
          step="any"
          name={`supplie_qty${index}`}
          id={`supplie_qty${index}`}
          defaultValue={supplyModule ? supplyModule.supplie_qty : ""}
          {...register(`supplie_qty${index}`, {
            required: "El campo es obligatorio",
            valueAsNumber: true,
          })}
        />
        {errors[`supplie_qty${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`supplie_qty${index}`].message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-1/2 my-2">
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
          defaultValue={supplyModule ? supplyModule.supplie_length : ""}
          {...register(`supplie_length${index}`)}
        />
        {errors[`supplie_length${index}`] && (
          <span className="text-xs xl:text-base text-red-700 mt-2 block text-left -translate-y-4">
            {errors[`supplie_length${index}`].message}
          </span>
        )}
      </div>
    </div>
  );
}

FormEditSupplies.propTypes = {
  register: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  errors: PropTypes.object.isRequired,
  supplies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  supplyModule: PropTypes.shape({
    supplie_id: PropTypes.string,
    supplie_name: PropTypes.string, // opcional / legacy
    supplie_qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    supplie_length: PropTypes.string,
  }),
  setValue: PropTypes.func.isRequired,
};

export { FormEditSupplies };
