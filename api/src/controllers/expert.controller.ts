import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { hash } from "bcrypt";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

class ExpertController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "Nome é obrigatório"),
      email: z.email("Email inválido").trim().toLowerCase(),
      password: z.string().min(6, "A senha deve ter no mínimo 6 dígitos"),
      role: z.enum(UserRole, "Role inválido").default(UserRole.expert),
      availableHours: z
        .array(z.string("Horário inválido"))
        .default([
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
        ]),
    });

    const { name, email, password, role, availableHours } = bodySchema.parse(
      request.body
    );

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
        availableHours,
      },
    });

    return response.status(201).json({ message: "Técnico criado com sucesso" });
  }

  async index(request: Request, response: Response) {
    const experts = await prisma.user.findMany({
      where: { role: UserRole.expert },
      select: {
        id: true,
        name: true,
        email: true,
        availableHours: true,
      },
    });

    return response.json(experts);
  }
}

export { ExpertController };
