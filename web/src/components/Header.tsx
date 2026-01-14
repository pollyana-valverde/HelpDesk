import React from "react";
// import { classMerge } from "../utils/classMerge";

import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router";

function HeaderRoot({ children, ...rest }: React.ComponentProps<"header">) {
  const head = React.Children.map(children, (child) =>
    (child as React.ReactElement).type === HeaderHead ? child : null
  );
  const action = React.Children.map(children, (child) =>
    (child as React.ReactElement).type === HeaderAction ? child : null
  );

  return (
    <header
      className="w-full grid gap-3 md:flex md:items-end"
      {...rest}
    >
      {head}
      {action}
    </header>
  );
}

function HeaderHead({
  children,
  goBack = false,
  ...rest
}: React.ComponentProps<"div"> & { goBack?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-1 flex-1" {...rest}>
      {goBack && (
        <Button
          color="link"
          size="small"
          className="mb-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar
        </Button>
      )}
      <h1 className="text-indigo-800 text-xl md:text-2xl font-bold">{children}</h1>
    </div>
  );
}

function HeaderAction({ children, ...rest }: React.ComponentProps<"div">) {
  return <div className="flex gap-2" {...rest}>{children}</div>;
}

export const Header = {
  Root: HeaderRoot,
  Head: HeaderHead,
  Action: HeaderAction,
};
