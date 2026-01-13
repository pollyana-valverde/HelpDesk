import { BrowserRouter } from "react-router";

import { useAuth } from "../hooks/useAuth";

import { Loading } from "../pages/Loading";

import { AuthRoutes } from "./Auth.routes";
import { AdminRoutes } from "./Admin.routes";

export function Routes() {
const { session, isLoading } = useAuth();

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

  if(isLoading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
}
