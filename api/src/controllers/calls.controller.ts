import { Request, Response } from "express";

class CallsController {
  async create(request: Request, response: Response) {
    return response.status(201).json({ message: "Chamada criada com sucesso" });
  }
}

export { CallsController };