import { classMerge } from "../../utils/classMerge";

export function CardRoot({ children, className, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      className={classMerge(
        "rounded-xl border border-gray-200 grid p-5 md:p-6",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
