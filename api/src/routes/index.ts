import { Router } from "express";

import { clientRoutes } from "./client.routes.js";
import { expertRoutes } from "./expert.routes.js";
import { sessionRoutes } from "./session.routes.js";
import { ticketsRoutes } from "./tickets.routes.js";
import { servicesRoutes } from "./services.routes.js";

import { ensureAuthenticated } from "../middlewares/ensure-authenticated.js";

const routes = Router();

// Rotas públicas
routes.use("/clients", clientRoutes);
routes.use("/sessions", sessionRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);

routes.use("/experts", expertRoutes);
routes.use("/tickets", ticketsRoutes);
routes.use("/services", servicesRoutes);

export { routes };