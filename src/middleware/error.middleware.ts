import { HttpError } from "@entities/http.error";
import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(err) && err.every(row => row instanceof ValidationError)) {
        const errors = err.map((row) => ({ message: Object.values(row.constraints) }));
        return res.status(400).send({ status: 400, errors });
    }

    // Handled errors
    if (err instanceof HttpError) {
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack,
            }, null, 2));
        }

        return res.status(statusCode).send({ status: statusCode, errors });
    }

    // Unhandled errors
    console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};