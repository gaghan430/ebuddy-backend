import { AuthRequest } from "@mdw/auth.middleware";
import UserRepository from "@repo/user.repository";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { UserModel } from "src/models/user.model";

class UserController {
    public static async show(req: AuthRequest, res: Response) {
        return res.json({
            status: "200",
            data: plainToInstance(UserModel, req.user).toJSON()
        });
    }

    public static async update(req: AuthRequest, res: Response) {
        const userRepo = new UserRepository();

        const [name] = req.user?.name.split('_');
        const user = await userRepo.update(req.user?.id, {
            name: name + "_" + Math.floor(Math.random() * 9999)
        })

        return res.json({
            status: "200",
            data: plainToInstance(UserModel, user).toJSON()
        });
    }
}

export default UserController;