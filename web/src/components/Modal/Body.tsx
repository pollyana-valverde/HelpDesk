export function ModalBody({
  children,
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div className="grid p-7 pb-8 border-y border-gray-200 gap-5" {...rest}>
      {children}
    </div>
  );
}