import { classMerge } from "../../utils/classMerge";

export function ModalFooter({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div className={classMerge("flex items-center px-7 py-6 gap-2", className)} {...rest}>
      {children}
    </div>
  );
}