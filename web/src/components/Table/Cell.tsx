import { classMerge } from "../../utils/classMerge";

export function TableCell({
  children,
  className,
  ...rest
}: React.ComponentProps<"td">) {
  return (
    <td className={classMerge("px-3 truncate", className)} {...rest}>
      {children}
    </td>
  );
}
