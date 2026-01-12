import { Router } from "express";

import { CallsController } from "../controllers/calls.controller";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const callsRoutes = Router();
const callsController = new CallsController();

callsRoutes.post("/", verifyAuthorization(["admin", "client"]), callsController.create);

export { callsRoutes };