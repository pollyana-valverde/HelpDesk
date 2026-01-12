import { Router } from "express";

import { UsersController } from "../controllers/users.controller.js";

import { ensureAuthenticated } from "../middlewares/ensure-authenticated.js";
import { verifyAuthorization } from "../middlewares/verify-authorization";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.get("/", ensureAuthenticated, verifyAuthorization(["admin"]), usersController.index);
usersRoutes.put("/:id", ensureAuthenticated, verifyAuthorization(["admin", "client"]), usersController.update);
usersRoutes.patch("/:id/password", ensureAuthenticated, verifyAuthorization([ "client"]), usersController.updatePassword);
usersRoutes.delete("/:id", ensureAuthenticated, verifyAuthorization(["admin", "client"]), usersController.delete);

export { usersRoutes };