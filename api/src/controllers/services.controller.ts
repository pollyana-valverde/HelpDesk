import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";

import { z } from "zod";
import { AppError } from "../utils/AppError.js";

class ServicesController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3, "o nome do serviço é obrigatório"),
            price: z.number("O preço deve ser um número").min(0, "o preço deve ser maior que zero"),
            isActive: z.boolean().default(true),
        });

        const { name, price, isActive } = bodySchema.parse(request.body);

        const serviceAlreadyExists = await prisma.service.findFirst({
            where: {
                name,
            },
        });

        if (serviceAlreadyExists) {
            throw new AppError("Já existe um serviço cadastrado com esse nome", 409);
        }

        const service = await prisma.service.create({
            data: {
                name,
                price,
                isActive,
            },
        });

        return response.status(201).json(service);
    }

    async index(request: Request, response: Response) {
        const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" },});

        return response.status(200).json(services);
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.uuid("ID inválido"),
        });

        const bodySchema = z.object({
            name: z.string().trim().min(3, "o nome do serviço é obrigatório").optional(),
            price: z.number("O preço deve ser um número").min(0, "o preço deve ser maior que zero").optional(),
            isActive: z.boolean("O status deve ser um booleano").optional(),
        });

        const { id } = paramsSchema.parse(request.params);
        const { name, price, isActive } = bodySchema.parse(request.body);
        const service = await prisma.service.findUnique({
            where: {
                id,
            },
        });

        if (!service) {
            throw new AppError("Serviço não encontrado", 404);
        }

        if (name) {
            const serviceAlreadyExists = await prisma.service.findFirst({
                where: {
                    name,
                    id: { not: id },
                },
            });

            if (serviceAlreadyExists) {
                throw new AppError("Já existe um serviço cadastrado com esse nome", 409);
            }
        }

        const updatedService = await prisma.service.update({
            where: {
                id,
            },
            data: {
                name,
                price,
                isActive,
            },
        });

        return response.status(200).json(updatedService);
    }
}

export { ServicesController };