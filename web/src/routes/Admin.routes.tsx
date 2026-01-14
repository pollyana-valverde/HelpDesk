import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Tickets } from "../pages/Tickets";
import { Experts } from "../pages/Experts";
import { Services } from "../pages/Services";
import { Clients } from "../pages/Clients";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Tickets />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
      </Route>
    </Routes>
  );
}
