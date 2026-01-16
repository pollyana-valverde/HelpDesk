import React from "react";

export function TableRoot({ children, ...rest }: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-300">
      <table className="w-full table-fixed md:table-auto text-left" {...rest}>
        {children}
      </table>
    </div>
  );
}