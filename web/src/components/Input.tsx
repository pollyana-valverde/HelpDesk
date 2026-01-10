import { forwardRef, type ForwardedRef } from "react";
import { classMerge } from "../utils/classMerge";

import { CircleAlert } from "lucide-react";

type Props = React.ComponentProps<"input"> & {
  legend?: string;
  helperText?: string;
  inputError?: boolean;
};

export const Input = forwardRef(function Input({ legend, helperText, type = "text", inputError, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <fieldset className={classMerge(
        "flex flex-1 flex-col text-gray-500",
        inputError ? "text-red-700 focus-within:text-red-700" : "focus-within:text-indigo-500"
    )}>
      {legend && (
        <legend className="uppercase text-xxs font-bold text-inherit">
          {legend}
        </legend>
      )}

      <input
        ref={ref}
        type={type}
        className={classMerge(
            "h-10 py-2 outline-none border-b border-gray-200 placeholder:text-gray-400 text-gray-800",
            inputError ? " focus:border-red-700" : "focus:border-indigo-500"
        )}
        {...rest}
      />

      {helperText && (
        <p className={classMerge(
            "text-xs mt-1.5 flex",
            inputError ? "text-red-700 " : "text-gray-400 italic"
        )}>{inputError && <CircleAlert className="w-4 h-4 mr-1" />}{helperText}</p>
      )}
    </fieldset>
  );
});
