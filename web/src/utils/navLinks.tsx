import type { LinkData } from "../components/NavLink";

import { ClipboardList, Users, BriefcaseBusiness, Wrench } from "lucide-react";

export const NAVLINKS: LinkData[] = [
  {
    label: "Chamados",
    path: "/",
    icon: <ClipboardList className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Técnicos",
    path: "/experts",
    icon: <Users className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Clientes",
    path: "/clients",
    icon: <BriefcaseBusiness className="w-5 h-5" />,
    role: "admin",
  },
  {
    label: "Serviços",
    path: "/services",
    icon: <Wrench className="w-5 h-5" />,
    role: "admin",
  },
];
