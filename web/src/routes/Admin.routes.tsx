import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Calls } from "../pages/Calls";
import { Experts } from "../pages/Experts";
import { Services } from "../pages/Services";
import { Clients } from "../pages/Clientes";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Calls />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
      </Route>
    </Routes>
  );
}
