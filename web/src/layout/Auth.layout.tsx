import { Outlet } from "react-router";

import loginBg from "../assets/Login_Background.svg";
import logoDark from "../assets//Logo_IconDark.svg";

export function AuthLayout() {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center pt-8 flex justify-end"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <main className="h-full w-full sm:rounded-t-3xl md:max-w-170  md:rounded-tr-none bg-gray-100 py-8 px-6 flex flex-col items-center ">
        <header className="flex gap-3 items-center">
          <img src={logoDark} alt="Logo Dark" className="h-10 w-10" />
          <h1 className="text-2xl text-indigo-800 font-bold">HelpDesk</h1>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
