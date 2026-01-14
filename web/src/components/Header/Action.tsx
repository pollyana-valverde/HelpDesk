import React from "react";
import { classMerge } from "../../utils/classMerge";

export function HeaderAction({ children, ...rest }: React.ComponentProps<"div">) {
  return (
    <div className={classMerge("flex gap-2", rest.className)} {...rest}>
      {children}
    </div>
  );
}
