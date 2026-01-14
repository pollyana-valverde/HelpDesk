import { classMerge } from "../utils/classMerge";

type ProfileIconProps = React.ComponentProps<"h1"> & {
  username?: string;
  sizeVariant?: "base" | "medium" | "small";
};

const profileIconSizeVariants = {
  base: "h-10 w-10 text-sm text-gray-100",
  medium: "h-7 w-7 text-xs text-gray-100",
  small: "h-5 w-5 text-[0.6rem] text-gray-100",
};

export function ProfileIcon({
  username,
  sizeVariant = "base",
  className,
  ...rest
}: ProfileIconProps) {
  const nameInParts = username?.split(" ") || [];
  const firstNameInitial = nameInParts[0] ? nameInParts[0][0] : "";
  const lastNameInitial = nameInParts.length > 1 ? nameInParts[1][0] : "";

  return (
    <h1
      className={classMerge(
        "uppercase bg-indigo-800 rounded-full flex items-center justify-center",
        profileIconSizeVariants[sizeVariant],
        className
      )}
      {...rest}
    >
      {firstNameInitial}
      {lastNameInitial}
    </h1>
  );
}
