import { Button } from "../Button";
import { X, ArrowLeft } from "lucide-react";

type ModalHeadProps = React.ComponentProps<"div"> & {
  onClose?: () => void;
  onGoBack?: () => void;
  goBack?: boolean;
};

export function ModalHead({
  children,
  className,
  onClose,
  onGoBack,
  goBack,
  ...rest
}: ModalHeadProps) {
  return (
    <div className="flex items-center px-7 py-5 gap-2" {...rest}>
      {goBack && (
        <Button color="link" size="icon" onClick={onGoBack}>
          <ArrowLeft className="w-4.5 h-4.5" />
        </Button>
      )}
      <h2 className="font-bold text-gray-800 flex-1">{children}</h2>
      <Button color="link" size="icon" onClick={onClose}>
        <X className="w-4.5 h-4.5"/>
      </Button>
    </div>
  );
}
