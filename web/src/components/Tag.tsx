import { classMerge } from "../utils/classMerge";

import { X, CircleHelp, Clock2, CircleCheck, CircleAlert } from "lucide-react";

type TagProps = React.ComponentProps<"span"> & {
  styleVariant?:
    | "default"
    | "selected"
    | "disabled"
    | "open"
    | "in_progress"
    | "closed"
    | "danger";
};

const stylesVariants = {
  tag: {
    default:
      "hover:bg-gray-300 text-gray-800 border border-gray-400 cursor-pointer",
    selected: "bg-indigo-500 text-gray-100 cursor-pointer",
    disabled: "border border-gray-300 text-gray-400 cursor-not-allowed",
    open: "text-pink-700 bg-pink-200",
    in_progress: "text-blue-700 bg-blue-200",
    closed: "text-lime-700 bg-lime-200",
    danger: "text-red-700 bg-red-200",
  },
};

export function Tag({ children, styleVariant = "default", className, ...rest }: TagProps) {
  return (
    <span
      className={classMerge(
        "rounded-full px-1.5 h-7 text-sm w-fit flex items-center justify-center gap-1.5 transition ease-linear",
        stylesVariants.tag[styleVariant],
        className
      )}
      {...rest}
    >
      {styleVariant === "open" && <CircleHelp className="w-4 h-4" />}
      {styleVariant === "in_progress" && <Clock2 className="w-4 h-4" />}
      {styleVariant === "closed" && <CircleCheck className="w-4 h-4" />}
      {styleVariant === "danger" && <CircleAlert className="w-4 h-4" />}
      {children}
      {styleVariant === "selected" && <X className="w-3.5 h-3.5" />}
    </span>
  );
}
