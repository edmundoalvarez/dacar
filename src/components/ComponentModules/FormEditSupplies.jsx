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
      const supplyValue = `${supplyModule.supplie_id}-${supplyModule.supplie_name}`;
      setSelectedSupply(supplyValue);
      setValue(`supplie_id_name${index}`, supplyValue);
      setValue(`supplie_qty${index}`, supplyModule.supplie_qty);
      setValue(`supplie_length${index}`, supplyModule.supplie_length);
    }
  }, [supplyModule, index, setValue]);

  const handleSupplyChange = (event) => {
    const value = event.target.value;
    setSelectedSupply(value);
    setValue(`supplie_id_name${index}`, value);
  };

  return (
    <div className="flex flex-wrap gap-x-4 w-full">
      <div className="flex flex-col w-2/12 my-2">
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
          value={selectedSupply} // Usar value para un componente controlado
          onChange={handleSupplyChange}
        >
          <option value="">Elegir una opción</option>
          {supplies.map((supplie) => (
            <option key={supplie._id} value={`${supplie._id}-${supplie.name}`}>
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
      <div className="flex flex-col w-2/12 my-2">
        <label htmlFor={`supplie_qty${index}`} className="font-semibold mb-1">
          Cantidad
        </label>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="number"
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
      <div className="flex flex-col w-2/12 my-2">
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
    supplie_name: PropTypes.string,
    supplie_qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    supplie_length: PropTypes.string,
  }),
  setValue: PropTypes.func.isRequired,
};

export { FormEditSupplies };
