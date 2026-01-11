import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./Auth.routes";
import { AdminRoutes } from "./Admin.routes";

export const session = "admin"; // Simulating a session value

export function Routes() {
  function Route() {
    switch (session) {
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
