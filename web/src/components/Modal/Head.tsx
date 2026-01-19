import { Button } from "../Button";
import { X } from "lucide-react";

type ModalHeadProps = React.ComponentProps<"div"> & {
  onClose?: () => void;
};

export function ModalHead({
  children,
  className,
  onClose,
  ...rest
}: ModalHeadProps) {
  return (
    <div className="flex items-center px-7 py-5" {...rest}>
      <h2 className="font-bold text-gray-800 flex-1">{children}</h2>
      <Button color="link" size="icon" onClick={onClose}>
        <X className="w-4.5 h-4.5"/>
      </Button>
    </div>
  );
}
