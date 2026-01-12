import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { TicketStatus, UserRole } from "../../generated/prisma/enums.js";

import { z } from "zod";
import { AppError } from "../utils/AppError.js";

class TicketsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().min(3, "O título é obrigatório"),
      description: z.string().min(10, "A descrição é obrigatória"),
      expertId: z.uuid("ID do técnico inválido"),
      serviceIds: z
        .array(z.uuid("ID de serviço inválido"))
        .min(1, "Selecione pelo menos um serviço"),
    });

    const { title, description, expertId, serviceIds } = bodySchema.parse(
      request.body
    );

    const expert = await prisma.user.findUnique({ where: { id: expertId } });

    if (!expert || expert.role !== UserRole.expert) {
      throw new AppError("Técnico não encontrado ou inválido.", 404);
    }

    const servicesCount = await prisma.service.count({
      where: {
        id: { in: serviceIds },
        isActive: true,
      },
    });

    if (servicesCount !== serviceIds.length) {
      throw new AppError("Um ou mais serviços são inválidos ou inativos.", 400);
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        clientId: request.user?.id!,
        expertId,
        services: {
          connect: serviceIds.map((id) => ({ id })),
        },
      },
      include: {
        client: {select: { name: true, email: true }},
        expert: {select: { name: true, email: true }},
        services: {select: { name: true, price: true }},
      },
    });

    return response.status(201).json(ticket);
  }

  async index(request: Request, response: Response) {
    const tickets = await prisma.ticket.findMany({
      include: {
        client: {select: { name: true, email: true }},
        expert: {select: { name: true, email: true }},
        services: {select: { name: true, price: true }},
      },
    });

    return response.json(tickets);
  }

  async showClientTickets(request: Request, response: Response) {
    const clientId = request.user?.id!;

    const tickets = await prisma.ticket.findMany({
      where: { clientId },
      include: {
        expert: {select: { name: true, email: true }},
        services: {select: { name: true, price: true }},
      },
    });

    if (tickets.length === 0) {
      throw new AppError("Nenhum chamado encontrado.", 404);
    }

    return response.json(tickets);
  }

  async showExpertTickets(request: Request, response: Response) {
    const expertId = request.user?.id!;

    const tickets = await prisma.ticket.findMany({
      where: { expertId },
      include: {
        client: {select: { name: true, email: true }},
        services: {select: { name: true, price: true }},
      },
    });

     if (tickets.length === 0) {
      throw new AppError("Nenhum chamado encontrado.", 404);
    }

    return response.json(tickets);
  }
}

export { TicketsController };
