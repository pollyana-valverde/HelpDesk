import { createContext } from "react";

interface NavigationContextType {
  isPagesMenuOpen: boolean;
  isUserMenuOpen: boolean;
  togglePagesMenu: () => void;
  toggleUserMenu: () => void;
  closePagesMenu: () => void;
  closeUserMenu: () => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
