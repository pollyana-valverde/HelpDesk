import { useState, type ReactNode } from "react";
import { NavigationContext } from "../../contexts/Navigation.context";

export function NavigationRoot({ children }: { children: ReactNode }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const toggleMenu = () => setOpenMenu((prev) => !prev);
  const toggleUser = () => setOpenUser((prev) => !prev);

  return (
    <NavigationContext.Provider
      value={{ openMenu, openUser, toggleMenu, toggleUser }}
    >
      <div className="w-full relative flex md:flex-col items-center p-6 md:py-5 md:px-4 gap-4 md:gap-2 md:max-w-50 md:items-start ">
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
