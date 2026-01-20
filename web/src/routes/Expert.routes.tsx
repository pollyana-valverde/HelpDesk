import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Ticket } from "../pages/Ticket/Index";

export function ExpertRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Ticket.ExpertList />} />
        <Route path="/tickets/:id/detail" element={<Ticket.Detail />} />
        <Route path="/tickets/new" element={<Ticket.Form />} />
      </Route>
    </Routes>
  );
}
