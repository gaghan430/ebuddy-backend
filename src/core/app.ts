import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import logger from "morgan";
import "express-async-errors";
import { errorMiddleware } from "@mdw/error.middleware";

class App {
    public express: express.Application;

    constructor(router: express.Router) {
        this.express = express();
        this.config();
        // Routers
        this.express.use(router);
        // Error handler
        this.express.use(errorMiddleware);
    }

    private config(): void {
        // Body parser to parse JSON and form-urlencoded payloads
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        // Pretty print for JSON repsonses
        this.express.set("json spaces", 4);
        // Logger for requests
        this.express.use(logger("common"));
        // CORS middleware
        this.express.use(cors({
            credentials: true,
            origin: process.env.CORS_ALLOW_ORIGIN || '*', // this work well to configure origin url in the server
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
            allowedHeaders: ['Content-Type', 'Authorization'] // allow json and token in the headers
        }));
        // Gzip compression of responses
        this.express.use(compression());
    }
}

export default App;