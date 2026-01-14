import { classMerge } from "../../utils/classMerge";

export function MenuContent({ children, className, ...rest }: React.ComponentProps<"nav">) {
  return (
    <nav className={classMerge("mt-4", className)} {...rest}>
      {children}
    </nav>
  );
}