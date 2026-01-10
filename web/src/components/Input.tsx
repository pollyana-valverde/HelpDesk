type Props = React.ComponentProps<"input"> & {
  legend?: string;
  helperText?: string;
};

export function Input({ legend, helperText, type = "text", ...rest }: Props) {
  return (
    <fieldset className="flex flex-1 flex-col text-gray-500 focus-within:text-indigo-500">
      {legend && (
        <legend className="uppercase text-xxs font-bold text-inherit">
          {legend}
        </legend>
      )}

      <input
        type={type}
        className="h-10 py-2 outline-none border-b border-gray-200 placeholder:text-gray-400 focus:border-indigo-500 text-gray-800"
        {...rest}
      />

      {helperText && (
        <p className="text-xs text-gray-400 mt-1.5 italic">{helperText}</p>
      )}
    </fieldset>
  );
}
