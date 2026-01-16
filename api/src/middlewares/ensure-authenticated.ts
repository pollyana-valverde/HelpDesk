import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../configs/auth";
import { AppError } from "../utils/AppError";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token está faltando", 401);
    }

    const [, token] = authHeader.split(" ");

    const { secret } = authConfig.jwt;

    const { role, sub: user_id } = jwt.verify(
      token,
      String(secret)
    ) as TokenPayload;

    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    console.log(error);
    
    throw new AppError("Token inválido ou expirado", 401);
  }
}

export { ensureAuthenticated };
