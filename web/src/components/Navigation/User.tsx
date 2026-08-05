import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import { useRef, useEffect } from "react";

import { Link } from "react-router";
import { ProfileIcon } from "../ProfileIcon";
import { LogOut, CircleUser } from "lucide-react";
import { Menu } from "../Menu/Index";

export function NavigationUser(props: React.ComponentProps<"div">) {
  const { isUserMenuOpen, toggleUserMenu, closeUserMenu } = useNavigation();
  const { session, logout } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora do container (avatar + menu)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeUserMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef}>
      {/* User Profile */}
      <div
        className="flex items-center justify-center cursor-pointer gap-3"
        onClick={toggleUserMenu}
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
      <Menu.Root
        isMenuOpen={isUserMenuOpen}
        className="w-2/3 right-6 md:w-50 md:bottom-1 md:top-auto md:left-51"
      >
        <Menu.Title>Opções</Menu.Title>

        <Menu.Content>
          <Link
            to="/profile"
            onClick={closeUserMenu}
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
        </Menu.Content>
      </Menu.Root>
    </div>
  );
}
