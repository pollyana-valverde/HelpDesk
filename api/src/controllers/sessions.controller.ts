import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { authConfig } from "../configs/auth";

import { compare } from "bcrypt";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";

class SessionController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email("Email inválido").trim().toLowerCase(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AppError("Email ou senha inválidos", 404);
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Email ou senha inválidos", 404);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign({ role: user.role }, String(secret), {
      subject: String(user.id),
      expiresIn: `${expiresIn}d`,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({
      message: "Sessão criada com sucesso",
      token,
      user: userWithoutPassword,
    });
  }
}

export { SessionController };
