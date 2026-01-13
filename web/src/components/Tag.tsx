import { classMerge } from "../utils/classMerge";

import { X, CircleHelp, Clock2, CircleCheck, CircleAlert } from "lucide-react";

type Props = React.ComponentProps<"span"> & {
  label: string | Array<string | number>;
  variant?:
    | "default"
    | "selected"
    | "disabled"
    | "open"
    | "in_progress"
    | "closed"
    | "danger";
};

const variants = {
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

export function Tag({ label, variant = "default", className, ...rest }: Props) {
  return (
    <span
      className={classMerge(
        "rounded-full px-3 h-7 text-sm w-fit flex items-center justify-center gap-1.5 transition ease-linear",
        variants.tag[variant],
        className
      )}
      {...rest}
    >
      {variant === "open" && <CircleHelp className="w-4 h-4" />}
      {variant === "in_progress" && <Clock2 className="w-4 h-4" />}
      {variant === "closed" && <CircleCheck className="w-4 h-4" />}
      {variant === "danger" && <CircleAlert className="w-4 h-4" />}
      {label}
      {variant === "selected" && <X className="w-3.5 h-3.5" />}
    </span>
  );
}
