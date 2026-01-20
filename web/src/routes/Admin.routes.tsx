import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Ticket } from "../pages/Ticket/Index";
import { Expert } from "../pages/Expert/Index";
import { Services } from "../pages/Service/Index";
import { Clients } from "../pages/Client/Index";

import { NotFound } from "../pages/NotFound";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Ticket.AdminList />} />
        <Route path="/tickets/:id/detail" element={<Ticket.Detail />} />
        <Route path="/experts" element={<Expert.List />} />
        <Route path="/experts/new" element={<Expert.Form />} />
        <Route path="/experts/:id/edit" element={<Expert.Form />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
