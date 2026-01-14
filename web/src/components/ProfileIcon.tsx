import { classMerge } from "../utils/classMerge";

type Props = React.ComponentProps<"h1"> & {
  username?: string;
  variant?: "base" | "medium" | "small";
};

const variants = {
  base: "h-10 w-10 text-sm text-gray-100",
  medium: "h-7 w-7 text-xs text-gray-100",
  small: "h-5 w-5 text-[0.6rem] text-gray-100",
};

export function ProfileIcon({
  username,
  variant = "base",
  className,
  ...rest
}: Props) {
  const nameParts = username?.split(" ") || [];
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
  const lastNameInitial = nameParts.length > 1 ? nameParts[1][0] : "";

  return (
    <h1
      className={classMerge(
        "uppercase bg-indigo-800 rounded-full flex items-center justify-center",
        variants[variant],
        className
      )}
      {...rest}
    >
      {firstNameInitial}
      {lastNameInitial}
    </h1>
  );
}
