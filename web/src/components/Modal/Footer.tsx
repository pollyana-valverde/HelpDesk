export function ModalFooter({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div className="flex items-center px-7 py-6 gap-2" {...rest}>
      {children}
    </div>
  );
}