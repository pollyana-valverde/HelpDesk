import { createContext } from "react";

interface NavigationContextType {
  openMenu: boolean;
  openUser: boolean;
  toggleMenu: () => void;
  toggleUser: () => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
