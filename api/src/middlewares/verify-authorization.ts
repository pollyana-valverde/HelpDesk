import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

function verifyAuthorization(role: string[]) {
  return (request: Request, _: Response, next: NextFunction) => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("Unauthorized", 401);
    }
    return next();
  };
}

export { verifyAuthorization };
