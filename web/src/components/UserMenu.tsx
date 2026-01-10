import { LogOut, CircleUser } from "lucide-react";

export function UserMenu() {
  return (
    <div className="bg-gray-900 absolute top-24 right-6 w-2/3 py-4 px-5 rounded-xl shadow-lg">
      <span className="text-gray-400 uppercase text-xxs">Opções</span>

      <div className="mt-4">
        <h2 className="text-gray-100 flex gap-2 h-10 items-center cursor-pointer">
          <CircleUser className="w-5 h-5" /> Perfil
        </h2>

        <h2 className="text-red-600 flex gap-2 h-10 items-center cursor-pointer">
          <LogOut className="w-5 h-5" /> Sair
        </h2>
      </div>
    </div>
  );
}
