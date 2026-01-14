export function TableHead({ children, ...rest }: React.ComponentProps<"thead">) {
  return (
    <thead className="h-12" {...rest}>
      <tr className="text-gray-400 text-sm font-bold">{children}</tr>
    </thead>
  );
}
