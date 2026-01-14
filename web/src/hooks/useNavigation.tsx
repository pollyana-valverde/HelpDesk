import { useContext } from "react";
import { NavigationContext } from "../contexts/Navigation.context";

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a Navigation.Root");
  }
  return context;
}