import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import { useLocation } from "react-router";

import { NAVLINKS } from "../../utils/navLinks";

import { NavLink } from "../NavLink";
import { Menu, X } from "lucide-react";

export function NavigationMenu(props: React.ComponentProps<"div">) {
  const { openMenu, toggleMenu } = useNavigation();
  const { session } = useAuth();
  const location = useLocation();

  const renderNavLinks = NAVLINKS.filter(
    (link) => link.role === session?.user?.role
  ).map((link) => (
    <NavLink
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
        onClick={toggleMenu}
      >
        {openMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </div>

      {/* Menu Mobile */}
      {openMenu && (
        <div className="bg-gray-900 absolute top-24 w-auto h-fit py-4 px-5 rounded-xl shadow-lg left-6 right-6 md:hidden">
          <span className="text-gray-400 uppercase text-xxs">Menu</span>
          <nav className="mt-4 gap-1 flex flex-col">{renderNavLinks}</nav>
        </div>
      )}

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