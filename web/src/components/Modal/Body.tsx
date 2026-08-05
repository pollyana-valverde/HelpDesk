import { classMerge } from "../../utils/classMerge";

export function ModalBody({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div className={classMerge("grid p-7 pb-8 border-y border-gray-200 gap-5", className)} {...rest}>
      {children}
    </div>
  );
}