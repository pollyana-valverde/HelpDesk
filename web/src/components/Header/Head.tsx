import React from "react";
import { classMerge } from "../../utils/classMerge";

import { ArrowLeft } from "lucide-react";
import { Button } from "../Button";
import { useNavigate } from "react-router";

export function HeaderHead({
  children,
  goBack = false,
  ...rest
}: React.ComponentProps<"div"> & { goBack?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className={classMerge("grid gap-1 flex-1", rest.className)} {...rest}>
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
      <h1
        className={classMerge(
          "text-indigo-800 text-xl md:text-2xl font-bold",
          rest.className
        )}
      >
        {children}
      </h1>
    </div>
  );
}
