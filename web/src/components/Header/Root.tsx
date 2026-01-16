import { classMerge } from "../../utils/classMerge";

export function HeaderRoot({
  children,
  ...rest
}: React.ComponentProps<"header">) {
  return (
    <header
      className={classMerge(
        "w-full grid gap-3 md:flex md:items-end",
        rest.className
      )}
      {...rest}
    >
      {children}
    </header>
  );
}
