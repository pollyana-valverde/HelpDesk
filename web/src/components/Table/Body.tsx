export function TableBody({ children, ...rest }: React.ComponentProps<"tbody">) {
  return <tbody {...rest}>{children}</tbody>;
}
