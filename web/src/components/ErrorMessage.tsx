import { CircleAlert } from "lucide-react";

type ErrorMessageProps = {
  message?: string | null;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (message) {
    return (
      <div className="w-full flex gap-2 p-3 items-center justify-center bg-red-200 border border-red-300 text-red-800 rounded-xl">
        <CircleAlert className="h-5 w-5" />
        <p>{message}</p>
      </div>
    );
  }
  return null;
}
