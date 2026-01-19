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
        client: { select: { name: true, email: true } },
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
    });

    return response.status(201).json(ticket);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const tickets = await prisma.ticket.findMany({
      skip,
      take: perPage,
      include: {
        client: { select: { name: true, email: true } },
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const totalRecords = await prisma.ticket.count();

    const totalPages = Math.ceil(totalRecords / perPage);

    const ticketsWithTotalPrice = tickets.map((ticket) => {
      const totalPrice = ticket.services.reduce(
        (sum, service) => sum + Number(service.price),
        0
      );
      return { ...ticket, totalPrice };
    });

    return response.json({
      tickets: ticketsWithTotalPrice,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID do chamado inválido"),
    });

    const { id } = paramsSchema.parse(request.params);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        client: { select: { name: true, email: true } },
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
    });

    if (!ticket) {
      throw new AppError("Chamado não encontrado.", 404);
    }

    const totalPrice = ticket.services.reduce(
      (sum, service) => sum + Number(service.price),
      0
    );

    return response.json({ ...ticket, totalPrice });
  }

  async showClientTickets(request: Request, response: Response) {
    const clientId = request.user?.id!;

    const tickets = await prisma.ticket.findMany({
      where: { clientId },
      include: {
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

     if (!tickets || tickets.length === 0) {
      throw new AppError("Chamados não encontrados.", 404);
    }

    const ticketsWithTotalPrice = tickets.map((ticket) => {
      const totalPrice = ticket.services.reduce(
        (sum, service) => sum + Number(service.price),
        0
      );
      return { ...ticket, totalPrice };
    });

    return response.json({ tickets: ticketsWithTotalPrice});
  }

  async showExpertTickets(request: Request, response: Response) {
    const expertId = request.user?.id!;

    const tickets = await prisma.ticket.findMany({
      where: { expertId },
      include: {
        client: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return response.json(tickets);
  }

  async updateStatus(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID do chamado inválido"),
    });

    const bodySchema = z.object({
      status: z.enum(TicketStatus, "Status inválido"),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new AppError("Chamado não encontrado.", 404);
    }

    if (ticket.status === status) {
      throw new AppError(`Ticket is already '${status}'.`, 400);
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    return response.json(updatedTicket);
  }

  async additionalServices(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID do chamado inválido"),
    });

    const bodySchema = z.object({
      serviceIds: z.array(z.uuid("ID de serviço inválido").trim()),
    });

    const { id } = paramsSchema.parse(request.params);
    const { serviceIds } = bodySchema.parse(request.body);

    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new AppError("Chamado não encontrado.", 404);
    }

    if (ticket.status === TicketStatus.closed) {
      throw new AppError("Chamados encerrados não podem ser atualizados.", 400);
    }

    if (!serviceIds || serviceIds.length === 0) {
      throw new AppError("Nenhum serviço fornecido para adicionar.", 400);
    }

    const existingServices = await prisma.ticket.findUnique({
      where: { id },
      select: {
        services: {
          where: {
            id: { in: serviceIds },
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (existingServices?.services && existingServices.services.length > 0) {
      throw new AppError(
        "O serviço fornecido já está associado ao chamado.",
        409
      );
    }

    const servicesCount = await prisma.service.count({
      where: {
        id: { in: serviceIds },
        isActive: true,
      },
    });

    if (servicesCount !== serviceIds.length) {
      throw new AppError("Um ou mais serviços são inválidos ou inativos.");
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        services: {
          connect: serviceIds.map((serviceId) => ({ id: serviceId })),
        },
      },
      include: {
        client: { select: { name: true, email: true } },
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
    });

    return response.json(updatedTicket);
  }

  async deleteAdditionalServices(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid("ID do chamado inválido"),
    });

    const bodySchema = z.object({
      serviceIds: z.array(z.uuid("ID de serviço inválido").trim()),
    });

    const { id } = paramsSchema.parse(request.params);
    const { serviceIds } = bodySchema.parse(request.body);

    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new AppError("Chamado não encontrado.", 404);
    }

    if (ticket.status === TicketStatus.closed) {
      throw new AppError("Chamados encerrados não podem ser atualizados.", 400);
    }

    const servicesCount = await prisma.service.count({
      where: {
        id: { in: serviceIds },
        tickets: {
          some: {
            id: id,
          },
        },
      },
    });

    if (servicesCount !== serviceIds.length) {
      throw new AppError(
        "Um ou mais serviços fornecidos não estão associados a este chamado.",
        404
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        services: {
          disconnect: serviceIds.map((serviceId) => ({ id: serviceId })),
        },
      },
      include: {
        client: { select: { name: true, email: true } },
        expert: { select: { name: true, email: true } },
        services: { select: { name: true, price: true } },
      },
    });

    return response.json(updatedTicket);
  }
}

export { TicketsController };
