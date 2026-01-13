import { Router } from "express";

import { TicketsController } from "../controllers/tickets.controller";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const ticketsRoutes = Router();
const ticketsController = new TicketsController();

ticketsRoutes.post("/", verifyAuthorization(["client"]), ticketsController.create);
ticketsRoutes.get("/", verifyAuthorization(["admin"]), ticketsController.index);

ticketsRoutes.get("/client", verifyAuthorization(["client"]), ticketsController.showClientTickets);
ticketsRoutes.get("/expert", verifyAuthorization(["expert"]), ticketsController.showExpertTickets);

ticketsRoutes.patch("/:id/status", verifyAuthorization(["admin", "expert"]), ticketsController.updateStatus);
ticketsRoutes.patch("/:id/services", verifyAuthorization(["expert"]), ticketsController.additionalServices);
ticketsRoutes.delete("/:id/services", verifyAuthorization(["expert"]), ticketsController.deleteAdditionalServices);

export { ticketsRoutes };