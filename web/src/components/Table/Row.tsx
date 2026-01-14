export function TableRow({ children, ...rest }: React.ComponentProps<"tr">) {
  return (
    <tr className="border-t border-gray-300 text-gray-800 h-16 hover:bg-gray-200 transition ease-linear" {...rest}>
      {children}
    </tr>
  );
}