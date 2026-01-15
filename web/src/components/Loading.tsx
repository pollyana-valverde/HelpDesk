type LoadingProps = {
  isLoading: boolean;
};

export function Loading({ isLoading }: LoadingProps) {
  if (isLoading) {
    return (
      <p className="text-sm font-bold w-full flex justify-center text-gray-800 ">
        Carregando...
      </p>
    );
  }
  return null;
}
