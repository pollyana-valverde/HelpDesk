import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { hash } from "bcrypt";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "Nome é obrigatório"),
      email: z.email("Email inválido").trim().toLowerCase(),
      password: z.string().min(6, "A senha deve ter no mínimo 6 dígitos"),
      role: z.enum(UserRole, "Role inválido").default(UserRole.client),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Já existe um usuário cadastrado com esse email", 409);
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return response.status(201).json({ message: "Usuário criado com sucesso" });
  }
}

export { UsersController };
