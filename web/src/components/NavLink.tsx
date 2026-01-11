import { Link, type LinkProps } from "react-router-dom";
import { classMerge } from "../utils/classMerge";

export type LinkData = {
  label: string;
  icon?: React.ReactNode;
  path: string;
  role: UserAPIRole;
};

type Props = Omit<LinkProps, "to"> & {
  links: LinkData;
  variant?: "default" | "active";
};

const variants = {
  color: {
    default: "text-gray-400 hover:text-gray-300 hover:bg-gray-800",
    active: "text-gray-100 bg-indigo-800",
  },
};

export function NavLink({ links, variant = "default", ...rest }: Props) {
  return (
    <Link
      to={links.path}
      {...rest}
      className={classMerge(
        "rounded-md flex gap-2 h-11 p-3 items-center cursor-pointer text-sm",
        variants.color[variant]
      )}
    >
      {links.icon} {links.label}
    </Link>
  );
}
