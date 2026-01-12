import { BrowserRouter } from "react-router";

import { useAuth } from "../hooks/useAuth";

import { AuthRoutes } from "./Auth.routes";
import { AdminRoutes } from "./Admin.routes";

export function Routes() {
const { session } = useAuth();

  function Route() {
    switch (session?.user.role) {
      case "admin":
        return <AdminRoutes />;
      // case "expert":
      // return <ExpertRoutes />;
      // case "client":
      // return <ClientRoutes />;
      default:
        return <AuthRoutes />;
    }
  }

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
}
