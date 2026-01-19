import { Router } from "express";

import { ServicesController } from "../controllers/services.controller.js"; 
import { verifyAuthorization } from "../middlewares/verify-authorization.js";

const servicesRoutes = Router();
const servicesController = new ServicesController();

servicesRoutes.post("/", verifyAuthorization(["admin"]), servicesController.create);
servicesRoutes.get("/", verifyAuthorization(["admin", "client", "expert"]), servicesController.index);
servicesRoutes.put("/:id/update", verifyAuthorization(["admin"]), servicesController.update);

export { servicesRoutes };