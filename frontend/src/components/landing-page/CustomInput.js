const CustomInput = ({
  label,
  type,
  id,
  name,
  placeholder,
  required,
}) => {
  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={id} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
      />
    </div>
  );
};

export default CustomInput;