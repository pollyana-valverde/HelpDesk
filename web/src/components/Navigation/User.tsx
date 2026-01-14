import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";

import { Link } from "react-router-dom";
import { ProfileIcon } from "../ProfileIcon";
import { LogOut, CircleUser } from "lucide-react";

export function NavigationUser(props: React.ComponentProps<"div">) {
  const { openUser, toggleUser } = useNavigation();
  const { session, logout } = useAuth();

  return (
    <>
      {/* User Profile */}
      <div
        className="flex items-center justify-center cursor-pointer gap-3"
        onClick={toggleUser}
        {...props}
      >
        <ProfileIcon username={session?.user?.name} />

        {/* User info desktop */}
        <div className="hidden md:flex md:flex-col">
          <h2 className="text-sm text-gray-100">{session?.user?.name}</h2>
          <p className="text-xs text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      {/* User Menu */}
      {openUser && (
        <div className="bg-gray-900 absolute top-24 w-2/3 h-fit py-4 px-5 rounded-xl shadow-lg right-6 md:w-50 md:bottom-1 md:top-auto md:left-51">
          <span className="text-gray-400 uppercase text-xxs">Opções</span>

          <div className="mt-4">
            <Link
              to="/profile"
              className="text-gray-100 flex gap-2 h-10 items-center cursor-pointer"
            >
              <CircleUser className="w-5 h-5" /> Perfil
            </Link>
            <a
              className="text-red-600 flex gap-2 h-10 items-center cursor-pointer"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" /> Sair
            </a>
          </div>
        </div>
      )}
    </>
  );
}