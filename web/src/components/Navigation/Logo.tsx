import { useAuth } from "../../hooks/useAuth";

import logoLight from "../../assets/Logo_IconLight.svg";

export function NavigationLogo(props: React.ComponentProps<"div">) {
  const { session } = useAuth();
  return (
    <div className="flex items-center gap-3 flex-1 md:flex-none" {...props}>
      <img src={logoLight} alt="Logo" className="w-11 h-11" />
      <div>
        <h1 className="text-xl font-bold text-gray-100">HelpDesk</h1>
        <p className="uppercase text-indigo-300 text-xxs">
          {session?.user?.role}
        </p>
      </div>
    </div>
  );
}