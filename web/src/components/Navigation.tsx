import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { classMerge } from "../utils/classMerge";
import { NAVLINKS } from "../utils/navLinks";

import { NavLink } from "./NavLink";
import { ProfileIcon } from "./ProfileIcon";
import { Menu, X, LogOut, CircleUser } from "lucide-react";

import logoLight from "../assets/Logo_IconLight.svg";

const variants = {
  userMenu: {
    user: "right-6 md:w-50 md:bottom-1 md:top-auto md:left-51",
    pages: "left-6 md:hidden",
  },
};

export function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const { session, logout } = useAuth();
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
    <div className="w-full relative flex md:flex-col items-center p-6 md:py-5 md:px-4 gap-4 md:gap-2 md:max-w-50 md:items-start ">
      <div
        className="bg-gray-800 text-gray-100 h-10 w-10 flex items-center justify-center rounded-md cursor-pointer md:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </div>

      {openMenu && (
        <div
          className={classMerge(
            "bg-gray-900 absolute top-24 w-2/3 h-fit py-4 px-5 rounded-xl shadow-lg ",
            variants.userMenu.pages
          )}
        >
          <span className="text-gray-400 uppercase text-xxs">Menu</span>

          <nav className="mt-4 gap-1 flex flex-col">{renderNavLinks}</nav>
        </div>
      )}

      <div className="flex items-center gap-3 flex-1 md:flex-none">
        <img src={logoLight} alt="Logo" className="w-11 h-11" />
        <div>
          <h1 className="text-xl font-bold text-gray-100">HelpDesk</h1>
          <p className="uppercase text-indigo-300 text-xxs">Admin</p>
        </div>
      </div>

      <div className="hidden my-4 md:flex md:flex-1 w-full border-b border-t border-gray-800 pt-5">
        <nav className="flex-col flex gap-1 w-full">{renderNavLinks}</nav>
      </div>

      <div
        className=" flex items-center justify-center cursor-pointer gap-3"
        onClick={() => setOpenUser(!openUser)}
      >
        <ProfileIcon username={session?.user?.name} />

        <div className="hidden md:flex md:flex-col">
          <h2 className="text-sm text-gray-100">{session?.user?.name}</h2>
          <p className="text-xs text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      {openUser && (
        <div
          className={classMerge(
            "bg-gray-900 absolute top-24 w-2/3 h-fit py-4 px-5 rounded-xl shadow-lg ",
            variants.userMenu.user
          )}
        >
          <span className="text-gray-400 uppercase text-xxs">Opções</span>

          <div className="mt-4">
            <a className="text-gray-100 flex gap-2 h-10 items-center cursor-pointer">
              <CircleUser className="w-5 h-5" /> Perfil
            </a>
            <a
              className="text-red-600 flex gap-2 h-10 items-center cursor-pointer"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" /> Sair
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
