import { forwardRef, type ForwardedRef } from "react";
import { classMerge } from "../utils/classMerge";

import { CircleAlert } from "lucide-react";

type SelectProps = React.ComponentProps<"select"> & {
  legend?: string;
  helperText?: string;
  hasValidationError?: boolean;
};

export const Select = forwardRef(function Select(
  { legend, helperText, hasValidationError, children, ...rest }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <fieldset
      className={classMerge(
        "flex flex-1 flex-col text-gray-500",
        hasValidationError
          ? "text-red-700 focus-within:text-red-700"
          : "focus-within:text-indigo-500",
      )}
    >
      {legend && (
        <legend className="uppercase text-xxs font-bold text-inherit">
          {legend}
        </legend>
      )}

      <select
        ref={ref}
        className={classMerge(
          "h-10 py-2 outline-none border-b border-gray-200 placeholder:text-gray-400 text-gray-800",
          hasValidationError
            ? " focus:border-red-700"
            : "focus:border-indigo-500",
        )}
        {...rest}
      >
        {children}
      </select>

      {helperText && (
        <p
          className={classMerge(
            "text-xs mt-1.5 flex",
            hasValidationError ? "text-red-700 " : "text-gray-400 italic",
          )}
        >
          {hasValidationError && <CircleAlert className="w-4 h-4 mr-1" />}
          {helperText}
        </p>
      )}
    </fieldset>
  );
});
