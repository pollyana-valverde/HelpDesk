import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Ticket } from "../pages/Ticket/Index";

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Ticket.ClientList />} />
        <Route path="/tickets/:id/detail" element={<Ticket.Detail />} />
      </Route>
    </Routes>
  );
}
