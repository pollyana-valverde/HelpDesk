import type { ComponentProps, ReactNode } from "react";
import { classMerge } from "../../utils/classMerge";

type MenuRootProps = ComponentProps<"div"> & {
  children: ReactNode;
  isMenuOpen: boolean;
};

export function MenuRoot({
  children,
  isMenuOpen,
  className,
  ...rest
}: MenuRootProps) {
  if (isMenuOpen) {
    return (
      <div
        className={classMerge(
          "bg-gray-900 absolute top-24 h-fit py-4 px-5 rounded-xl shadow-lg",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
  return null;
}

