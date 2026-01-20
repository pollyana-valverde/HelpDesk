import type { LinkData } from "../components/Navigation/Link";

import { ClipboardList, Users, BriefcaseBusiness, Wrench, Plus } from "lucide-react";

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
  {
    label: "Meus chamados",
    path: "/",
    icon: <ClipboardList className="w-5 h-5" />,
    role: "expert",
  },
  {
    label: "Meus chamados",
    path: "/",
    icon: <ClipboardList className="w-5 h-5" />,
    role: "client",
  },
  {
    label: "Criar chamado",
    path: "/tickets/new",
    icon: <Plus className="w-5 h-5" />,
    role: "client",
  },
];
