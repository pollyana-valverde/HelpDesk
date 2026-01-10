import { Route, Routes } from "react-router";

import { AppLayout } from "../layout/App.layout";

import { Calls } from "../pages/Calls";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Calls />} />
      </Route>
    </Routes>
  );
}
