import { useState, type ReactNode } from "react";
import { NavigationContext } from "../../contexts/Navigation.context";

export function NavigationRoot({ children }: { children: ReactNode }) {
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const togglePagesMenu = () => setIsPagesMenuOpen((prev) => !prev);
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);
  return (
    <NavigationContext.Provider
      value={{ isPagesMenuOpen, isUserMenuOpen, togglePagesMenu, toggleUserMenu }}
    >
      <div className="w-full relative flex md:flex-col items-center p-6 md:py-5 md:px-4 gap-4 md:gap-2 md:max-w-50 md:items-start ">
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
