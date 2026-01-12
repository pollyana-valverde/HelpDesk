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

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      where: { role: UserRole.client },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return response.json(users);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID inválido"),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(3, "Nome é obrigatório").optional(),
      email: z.email("Email inválido").trim().toLowerCase().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, email } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== UserRole.client) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (request.user?.role === UserRole.client && request.user?.id !== id) {
      throw new AppError("Você só pode alterar seu próprio usuário", 403);
    }

    if (email) {
      const userWithSameEmail = await prisma.user.findFirst({
        where: { email },
      });

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new AppError(
          "Já existe um usuário cadastrado com esse email",
          409
        );
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return response.json({ message: "Usuário atualizado com sucesso" });
  }

  async updatePassword(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID inválido"),
    });

    const bodySchema = z.object({
      password: z.string().min(6, "A senha deve ter no mínimo 6 dígitos"),
    });

    const { id } = paramsSchema.parse(request.params);
    const { password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== UserRole.client) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (id !== request.user?.id) {
      throw new AppError("Você só pode alterar sua própria senha", 403);
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return response.json({ message: "Senha atualizada com sucesso" });
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID inválido"),
    });

    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== UserRole.client) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (request.user?.role === UserRole.client && request.user?.id !== id) {
      throw new AppError("Você só pode deletar seu próprio usuário", 403);
    }

    await prisma.user.delete({
      where: { id },
    });

    return response.json({ message: "Usuário deletado com sucesso" });
  }
}

export { UsersController };
