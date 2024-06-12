import config from "@config/config";
import BadRequestError from "@entities/bad-request.error";
import UserRepository from "@repo/user.repository";
import bcrypt from 'bcryptjs';
import { plainToInstance } from "class-transformer";
import { validateOrReject, } from "class-validator";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { LoginInput, RegisterInput } from "src/models/auth.model";
import { UserModel } from "src/models/user.model";
import { v4 as uuidv4 } from 'uuid';

class AuthController {
    public static async register(req: Request, res: Response) {
        const dtoRegister = plainToInstance(RegisterInput, req.body);
        await validateOrReject(dtoRegister);

        const userRepo = new UserRepository();

        const isExists = await userRepo.readyByEmail(dtoRegister.email);
        if (isExists) {
            throw new BadRequestError({ message: 'Email has already been used' })
        }

        const user = await userRepo.create({
            ...dtoRegister,
            id: uuidv4(),
            password: await bcrypt.hash(dtoRegister.password, 8)
        });

        const token = jwt.sign({ id: user?.id, email: user?.email }, config.jwt_key || '');

        return res.json({
            status: 200,
            data: {
                user: plainToInstance(UserModel, user).toJSON(),
                token
            }
        });
    }

    public static async login(req: Request, res: Response) {
        const dtoLogin = plainToInstance(LoginInput, req.body);
        await validateOrReject(dtoLogin);

        const userRepo = new UserRepository();
        const user = await userRepo.readyByEmail(dtoLogin.email);
        if (!user) {
            throw new BadRequestError({ code: 404, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(dtoLogin.password, user.password);
        if (!isMatch) {
            throw new BadRequestError({ message: 'Email / password is not correct' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, config.jwt_key || '');

        return res.json({
            status: 200,
            data: {
                user: plainToInstance(UserModel, user).toJSON(),
                token
            }
        });
    }
}

export default AuthController;