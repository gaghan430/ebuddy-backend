import UserController from "@controller/user.controller";
import auth from "@mdw/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/fetch-user-data", auth, UserController.show);
router.put("/update-user-data", auth, UserController.update)

export { router };
