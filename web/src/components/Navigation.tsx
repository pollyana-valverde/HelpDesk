import { useState } from "react";
import { session } from "../routes";

import { classMerge } from "../utils/classMerge";

import { NavLink, type LinkData } from "./NavLink";
import {
  Menu,
  X,
  LogOut,
  CircleUser,
  ClipboardList,
  Users,
  BriefcaseBusiness,
  Wrench,
} from "lucide-react";

import logoLight from "../assets/Logo_IconLight.svg";

const variants = {
  userMenu: {
    user: "right-6 md:w-50 md:bottom-1 md:top-auto md:left-51",
    pages: "left-6 md:hidden",
  },
};

const menuLinks: LinkData[] = [
  {
    label: "Chamados",
    path: "/",
    icon: <ClipboardList className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Técnicos",
    path: "/",
    icon: <Users className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Clientes",
    path: "/",
    icon: <BriefcaseBusiness className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Serviços",
    path: "/",
    icon: <Wrench className="w-5 h-5" />,
    role: "admin",
  },
];

export function Navigation() {
  const [openMenu, setOpenMenu] = useState(true);
  const [openUser, setOpenUser] = useState(false);
  const [activeLink, setActiveLink] = useState("Chamados");

  const renderNavLinks = menuLinks
    .filter((link) => link.role === session)
    .map((link) => (
      <NavLink
        key={link.label}
        links={link}
        variant={link.label === activeLink ? "active" : "default"}
        onClick={() => setActiveLink(link.label)}
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
        <h1 className="text-gray-100 text-sm uppercase bg-indigo-800 h-10 w-10 rounded-full flex items-center justify-center">
          Pv
        </h1>
        <div className="hidden md:flex md:flex-col">
          <h2 className="text-sm text-gray-100">Usuário Adm</h2>
          <p className="text-xs text-gray-400">user.adm@text.com</p>
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
            <a className="text-red-600 flex gap-2 h-10 items-center cursor-pointer">
              <LogOut className="w-5 h-5" /> Sair
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
