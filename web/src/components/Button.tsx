import { classMerge } from "../utils/classMerge";

type ButtonProps = React.ComponentProps<"button"> & {
  isLoading?: boolean;
  color?: "primary" | "secondary" | "link";
  size?: "base" | "small" | "icon" | "iconSmall";
};

const buttonStyleVariants = {
  color: {
    primary: "bg-gray-800 text-gray-100 hover:bg-gray-900 ",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900",
    link: "text-gray-500 p-0.5 h-fit hover:bg-gray-300 hover:text-gray-900",
  },
  size: {
    base: "w-full md:w-auto px-4 h-10 text-sm",
    small: "w-fit px-2 h-7 text-xs",
    icon: "w-10 h-10",
    iconSmall: "w-7 h-7",
  },
};

export function Button({
  isLoading,
  children,
  className,
  type = "button",
  color = "primary",
  size = "base",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={classMerge(
        "rounded-md transition ease-linear font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75",
        buttonStyleVariants.size[size],
        buttonStyleVariants.color[color],
        isLoading && "cursor-progress",
        className
      )}
      {...rest}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
