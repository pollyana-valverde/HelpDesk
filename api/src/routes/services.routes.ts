import { Router } from "express";

import { ServicesController } from "../controllers/services.controller.js"; 
import { verifyAuthorization } from "../middlewares/verify-authorization.js";

const servicesRoutes = Router();
const servicesController = new ServicesController();

servicesRoutes.use(verifyAuthorization(["admin"]));

servicesRoutes.post("/", servicesController.create);
servicesRoutes.get("/", servicesController.index);

export { servicesRoutes };