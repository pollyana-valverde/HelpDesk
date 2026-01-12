import { AppError } from "../utils/AppError.js";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            message: error.message,
        });
    }

    if (error instanceof ZodError) {
        return response.status(400).json({
            message: "Validation error",
            issues: error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
                code: issue.code,
            })),
        });
    }

    console.error(error);

    return response.status(500).json({
        message: error.message,
    });
}