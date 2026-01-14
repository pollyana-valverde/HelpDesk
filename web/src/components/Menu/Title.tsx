export function MenuTitle({ children, ...rest }: React.ComponentProps<"span">) {
  return (
    <span
      className="text-gray-400 uppercase text-xxs"
      {...rest}
    >
      {children}
    </span>
  );
}