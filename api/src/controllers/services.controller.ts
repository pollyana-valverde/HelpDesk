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
        const services = await prisma.service.findMany();

        return response.status(200).json(services);
    }
}

export { ServicesController };