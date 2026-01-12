import { Router } from "express";

import { TicketsController } from "../controllers/tickets.controller";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const ticketsRoutes = Router();
const ticketsController = new TicketsController();
ticketsRoutes.post("/", verifyAuthorization(["admin", "client"]), ticketsController.create);

export { ticketsRoutes };