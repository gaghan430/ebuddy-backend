
export type HttpErrorContent = {
    message: string,
    context?: { [key: string]: any }
};

export abstract class HttpError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: HttpErrorContent[];
    abstract readonly logging: boolean;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}