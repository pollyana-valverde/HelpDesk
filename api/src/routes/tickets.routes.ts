import { Router } from "express";

import { TicketsController } from "../controllers/tickets.controller";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const ticketsRoutes = Router();
const ticketsController = new TicketsController();

ticketsRoutes.post("/new", verifyAuthorization(["client"]), ticketsController.create);
ticketsRoutes.get("/", verifyAuthorization(["admin"]), ticketsController.index);
ticketsRoutes.get("/:id/show-detail", verifyAuthorization(["admin", "expert", "client"]), ticketsController.show);

ticketsRoutes.get("/client", verifyAuthorization(["client"]), ticketsController.showClientTickets);
ticketsRoutes.get("/expert", verifyAuthorization(["expert"]), ticketsController.showExpertTickets);

ticketsRoutes.patch("/:id/update-status", verifyAuthorization(["admin", "expert"]), ticketsController.updateStatus);
ticketsRoutes.patch("/:id/add-services", verifyAuthorization(["expert"]), ticketsController.additionalServices);
ticketsRoutes.delete("/:id/delete-services", verifyAuthorization(["expert"]), ticketsController.deleteAdditionalServices);

export { ticketsRoutes };