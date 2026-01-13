import React from "react";

function TableRoot({ children, ...rest }: React.ComponentProps<"table">) {
  const head = React.Children.map(children, (child) =>
    (child as React.ReactElement).type === TableHead ? child : null
  );
  const body = React.Children.map(children, (child) =>
    (child as React.ReactElement).type === TableBody ? child : null
  );

  return (
    <div className="w-full overflow-scroll rounded-xl border border-gray-300">
      <table className="w-full table-fixed md:table-auto text-left" {...rest}>
        {head}
        {body}
      </table>
    </div>
  );
}

function TableHead({ children, ...rest }: React.ComponentProps<"thead">) {
  return (
    <thead className="h-12" {...rest}>
      <tr className="text-gray-400 text-sm font-bold">{children}</tr>
    </thead>
  );
}

function TableBody({ children, ...rest }: React.ComponentProps<"tbody">) {
  return <tbody {...rest}>{children}</tbody>;
}

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
};
