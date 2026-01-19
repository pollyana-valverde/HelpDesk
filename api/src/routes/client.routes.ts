import { Router } from "express";

import { ClientController } from "../controllers/client.controller.js";

import { ensureAuthenticated } from "../middlewares/ensure-authenticated.js";
import { verifyAuthorization } from "../middlewares/verify-authorization.js";

const clientRoutes = Router();
const clientController = new ClientController();

clientRoutes.post("/", clientController.create);

clientRoutes.use(ensureAuthenticated);

clientRoutes.get("/", verifyAuthorization(["admin"]), clientController.index);
clientRoutes.put("/:id/update", verifyAuthorization(["admin", "client"]), clientController.update);
clientRoutes.patch("/update-password", verifyAuthorization([ "client"]), clientController.updatePassword);
clientRoutes.delete("/:id/delete", verifyAuthorization(["admin", "client"]), clientController.delete);

export { clientRoutes };