import { Outlet } from "react-router";

import { Navigation } from "../components/Navigation/Index";

export function AppLayout() {
  return (
    <main className="w-screen h-screen bg-gray-900 md:pt-8 md:flex overflow-hidden">
      <Navigation.Root>
        <Navigation.Logo />
        <Navigation.Menu />
        <Navigation.User />
      </Navigation.Root>
      <div className="bg-gray-100 h-full flex-1 rounded-t-3xl overflow-y-scroll md:rounded-tr-none py-7 px-6 md:px-12 md:py-13">
        <Outlet />
      </div>
    </main>
  );
}
