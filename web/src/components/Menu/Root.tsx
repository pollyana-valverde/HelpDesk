import type { ComponentProps, ReactNode } from "react";
import { classMerge } from "../../utils/classMerge";

type MenuRootProps = ComponentProps<"div"> & {
  children: ReactNode;
  isMenuClosed: boolean;
};

export function MenuRoot({ children, isMenuClosed, className, ...rest }: MenuRootProps) {
  if (isMenuClosed) {
    return null;
  }

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