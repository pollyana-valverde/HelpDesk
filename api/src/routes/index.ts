import { Router } from "express";

import { usersRoutes } from "./users.routes.js";
import { sessionRoutes } from "./session.routes.js";
import { callsRoutes } from "./calls.routes.js";
import { expertRoutes } from "./expert.routes.js";

import { ensureAuthenticated } from "../middlewares/ensure-authenticated.js";

const routes = Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);

routes.use("/experts", expertRoutes);
routes.use("/calls", callsRoutes);

export { routes };