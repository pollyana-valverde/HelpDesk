import { classMerge } from "../utils/classMerge";

type Props = React.ComponentProps<"button"> & {
  isLoading?: boolean;
  color?: "primary" | "secondary";
  size?: "base" | "small" | "icon" | "iconSmall";
};

const variants = {
  color: {
    primary: "bg-gray-800 text-gray-100 hover:bg-gray-900 ",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-900",
  },
  size: {
    base: "w-full px-4 h-10 text-sm",
    small: "w-full px-2 h-7 text-xs",
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
}: Props) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={classMerge(
        "rounded-md transition ease-linear font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75",
        variants.size[size],
        variants.color[color],
        isLoading && "cursor-progress",
        className
      )}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
