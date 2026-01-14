import { useState, type ReactNode } from "react";
import { NavigationContext } from "../../contexts/Navigation.context";

export function NavigationRoot({ children }: { children: ReactNode }) {
  const [isPagesMenuClosed, setIsPagesMenuClosed] = useState(true);
  const [isUserMenuClosed, setIsUserMenuClosed] = useState(true);

  const togglePagesMenu = () => setIsPagesMenuClosed((prev) => !prev);
  const toggleUserMenu = () => setIsUserMenuClosed((prev) => !prev);

  return (
    <NavigationContext.Provider
      value={{ isPagesMenuClosed, isUserMenuClosed, togglePagesMenu, toggleUserMenu }}
    >
      <div className="w-full relative flex md:flex-col items-center p-6 md:py-5 md:px-4 gap-4 md:gap-2 md:max-w-50 md:items-start ">
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
