import AuthController from "@controller/auth.contoller";
import { Router } from "express";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login)

export { router };
