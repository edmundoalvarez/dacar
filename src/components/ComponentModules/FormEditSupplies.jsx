import { useEffect } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import Select from "react-select";

function FormEditSupplies({
  register,
  index,
  errors,
  supplies,
  supplyModule,
  setValue,
  control,
}) {
  useEffect(() => {
    if (supplyModule) {
      const id = supplyModule.supplie_id || "";
      setValue(`supplie_id${index}`, id);
      setValue(`supplie_qty${index}`, supplyModule.supplie_qty);
      setValue(`supplie_length${index}`, supplyModule.supplie_length);
    }
  }, [supplyModule, index, setValue]);
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#10b981" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      minHeight: "40px",
      backgroundColor: "#ffffff",
      color: "#111827",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280",
    }),
    input: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({ ...base, zIndex: 30 }),
    menuList: (base) => ({ ...base, backgroundColor: "#ffffff" }),
    option: (base, state) => ({
      ...base,
      color: "#111827",
      backgroundColor: state.isSelected
        ? "#d1fae5"
        : state.isFocused
          ? "#f3f4f6"
          : "#ffffff",
    }),
  };

  const supplyOptions = supplies.map((supplie) => ({
    value: supplie._id,
    label: supplie.name,
  }));

  return (
    <div className="flex gap-x-4 w-full border-2 border-emerald-600 rounded-lg p-10 mb-6">
      <div className="flex flex-col w-1/2 my-2">
        <label htmlFor={`supplie_id${index}`} className="font-semibold mb-1">
          Insumo
        </label>
        <Controller
          name={`supplie_id${index}`}
          control={control}
          rules={{ required: "El campo es obligatorio" }}
          defaultValue={supplyModule?.supplie_id || ""}
          render={({ field }) => (
            <Select
              inputId={`supplie_id${index}`}
              instanceId={`supplie_id${index}`}
              placeholder="Elegir una opción"
              isClearable
              options={supplyOptions}
              value={
                supplyOptions.find(
                  (option) => option.value === field.value
                ) || null
              }
              onChange={(option) => field.onChange(option?.value || "")}
              styles={selectStyles}
            />
          )}
        />
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
  control: PropTypes.object.isRequired,
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
