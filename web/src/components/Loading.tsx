export function Loading({ isLoaded }: { isLoaded?: boolean }) {
  if (isLoaded) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <p className="text-sm font-bold text-gray-800">Carregando...</p>
    </div>
  );
}
