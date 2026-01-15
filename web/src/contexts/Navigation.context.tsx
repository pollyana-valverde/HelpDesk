import { createContext } from "react";

interface NavigationContextType {
  isPagesMenuOpen: boolean;
  isUserMenuOpen: boolean;
  togglePagesMenu: () => void;
  toggleUserMenu: () => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
