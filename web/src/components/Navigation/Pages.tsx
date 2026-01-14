import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import { useLocation } from "react-router";

import { NAVLINKS } from "../../utils/navLinks";

import { NavigationLink } from "./Link";
import { MenuIcon, X } from "lucide-react";
import { Menu } from "../Menu/Index";

export function NavigationPages(props: React.ComponentProps<"div">) {
  const { isPagesMenuClosed, togglePagesMenu } = useNavigation();
  const { session } = useAuth();
  const location = useLocation();

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
      {/* Menu Mobile Button */}
      <div
        className="bg-gray-800 text-gray-100 h-10 w-10 flex items-center justify-center rounded-md cursor-pointer md:hidden"
        onClick={togglePagesMenu}
      >
        {isPagesMenuClosed ? (
          <MenuIcon className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </div>

      {/* Menu Mobile */}
      <Menu.Root
        isMenuClosed={isPagesMenuClosed}
        className="w-auto left-6 right-6 md:hidden"
      >
        <Menu.Title>Menu</Menu.Title>
        <Menu.Content className="gap-1 flex flex-col">
          {renderNavLinks}
        </Menu.Content>
      </Menu.Root>

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
