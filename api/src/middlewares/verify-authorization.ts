import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

function verifyAuthorization(role: string[]) {
  return (request: Request, _: Response, next: NextFunction) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("Você não tem permissão para executar esta ação.", 403);
    }
    return next();
  };
}

export { verifyAuthorization };
