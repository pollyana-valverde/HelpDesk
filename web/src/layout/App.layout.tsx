import { Outlet } from "react-router";

import { Navigation } from "../components/Navigation";

export function AppLayout() {
  return (
    <main className="w-screen h-screen bg-gray-900 md:pt-8 md:flex ">
      <Navigation />
      <div className="bg-gray-100 h-full flex-1 rounded-t-3xl md:rounded-tr-none py-7 px-6 md:px-12 md:py-13">
        <Outlet />
      </div>
    </main>
  );
}
