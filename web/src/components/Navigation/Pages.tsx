import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";

import { NAVLINKS } from "../../utils/navLinks";

import { NavigationLink } from "./Link";
import { MenuIcon, X } from "lucide-react";
import { Menu } from "../Menu/Index";

export function NavigationPages(props: React.ComponentProps<"div">) {
  const { isPagesMenuOpen, togglePagesMenu, closePagesMenu } = useNavigation();
  const { session } = useAuth();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao navegar
  useEffect(() => {
    closePagesMenu();
  }, [location.pathname]);

  // Fecha ao clicar fora do container (botão + menu)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closePagesMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderNavLinks = NAVLINKS.filter(
    (link) => link.role === session?.user?.role
  ).map((link) => (
    <NavigationLink
      key={link.label}
      links={link}
      variant={location.pathname === link.path ? "active" : "default"}
    />
  ));

  return (
    <>
      {/* Menu Mobile Button + dropdown — agrupados para o click-outside */}
      <div ref={containerRef} className="md:hidden">
        <div
          className="bg-gray-800 text-gray-100 h-10 w-10 flex items-center justify-center rounded-md cursor-pointer"
          onClick={togglePagesMenu}
        >
          {isPagesMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </div>

        <Menu.Root
          isMenuOpen={isPagesMenuOpen}
          className="w-auto left-6 right-6"
        >
          <Menu.Title>Menu</Menu.Title>
          <Menu.Content className="gap-1 flex flex-col">
            {renderNavLinks}
          </Menu.Content>
        </Menu.Root>
      </div>

      {/* Menu desktop */}
      <div
        className="hidden my-4 md:flex md:flex-1 w-full border-b border-t border-gray-800 pt-5"
        {...props}
      >
        <nav className="flex-col flex gap-1 w-full">{renderNavLinks}</nav>
      </div>
    </>
  );
}
