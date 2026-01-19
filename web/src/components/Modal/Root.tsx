import { classMerge } from "../../utils/classMerge";

export function ModalRoot({children, className, ...rest}: React.ComponentProps<"div">) {
  return (
    <div className={classMerge(
      "grid fixed inset-0 bg-black/50 w-screen h-screen z-10 place-items-center p-4",
      className
    )} {...rest}>
      <div className={classMerge(
        "bg-gray-100 rounded-xl max-w-150 w-full h-fit"
      )}>
        {children}
      </div>
    </div>
  );
}