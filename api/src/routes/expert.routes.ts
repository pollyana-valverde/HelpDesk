import { Router } from "express";

import { ExpertController } from "../controllers/expert.controller";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const expertRoutes = Router();
const expertController = new ExpertController();

expertRoutes.post("/", verifyAuthorization(["admin"]), expertController.create);
expertRoutes.get("/", verifyAuthorization(["admin"]), expertController.index);
expertRoutes.get("/:id/show-details", verifyAuthorization(["admin"]), expertController.show);
expertRoutes.put("/:id/update", verifyAuthorization(["admin"]), expertController.update);
expertRoutes.patch("/update-password", verifyAuthorization(["expert"]), expertController.updatePassword);

export { expertRoutes };