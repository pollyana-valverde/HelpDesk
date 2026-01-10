import { useState } from "react";

import { UserMenu } from "./UserMenu";
import { Menu, X } from "lucide-react";

import logoLight from "../assets/Logo_IconLight.svg";

export function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(true);

  return (
    <div className="w-full relative flex md:flex-col items-center p-6 gap-4 md:max-w-50 md:items-start md:justify-between">
      <div
        className="bg-gray-800 text-gray-100 h-10 w-10 flex items-center justify-center rounded-md cursor-pointer md:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </div>

      <div className="flex items-center gap-3 flex-1 md:flex-none">
        <img src={logoLight} alt="Logo" className="w-11 h-11" />
        <div>
          <h1 className="text-xl font-bold text-gray-100">HelpDesk</h1>
          <p className="uppercase text-indigo-300 text-xxs">Admin</p>
        </div>
      </div>

      <div
        className="bg-indigo-800 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setOpenUser(!openUser)}
      >
        <h1 className="text-gray-100 text-sm uppercase">Pv</h1>
      </div>
      {openUser && <UserMenu />}
    </div>
  );
}
