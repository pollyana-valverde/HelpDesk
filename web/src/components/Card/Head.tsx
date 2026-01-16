import { classMerge } from "../../utils/classMerge";

export function CardHead({children, className, ...rest}: React.ComponentProps<"div">) {
    return(
        <div className={classMerge("grid", className)} {...rest}>
            {children}
        </div>
    )
}