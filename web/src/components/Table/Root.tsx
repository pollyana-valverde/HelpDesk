import React from "react";

export function TableRoot({ children, ...rest }: React.ComponentProps<"table">) {
//   const head = React.Children.map(children, (child) =>
//     (child as React.ReactElement).type === TableHead ? child : null
//   );
//   const body = React.Children.map(children, (child) =>
//     (child as React.ReactElement).type === TableBody ? child : null
//   );

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-300">
      <table className="w-full table-fixed md:table-auto text-left" {...rest}>
        {/* {head} */}
        {children}
      </table>
    </div>
  );
}