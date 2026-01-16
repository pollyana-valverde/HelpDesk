import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Ticket } from "../pages/Ticket/Index";
import { Expert } from "../pages/Expert/Index";
import { Services } from "../pages/Services";
import { Clients } from "../pages/Clients";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Ticket.List />} />
        <Route path="/tickets/:id/detail" element={<Ticket.Detail />} />
        <Route path="/experts" element={<Expert.List />} />
        <Route path="/experts/new" element={<Expert.Form />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
      </Route>
    </Routes>
  );
}
