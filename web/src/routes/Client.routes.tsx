import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Ticket } from "../pages/Ticket/Index";
import { Profile } from "../pages/Profile/Index";

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Ticket.ClientList />} />
        <Route path="/tickets/:id/detail" element={<Ticket.Detail />} />
        <Route path="/tickets/new" element={<Ticket.Form />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
