import { createContext } from "react";

interface NavigationContextType {
  isPagesMenuClosed: boolean;
  isUserMenuClosed: boolean;
  togglePagesMenu: () => void;
  toggleUserMenu: () => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
