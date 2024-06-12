import BadRequestError from '@entities/bad-request.error'
import UserRepository from '@repo/user.repository'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: any
    token?: string
}

interface DecodedToken {
    id: string
    email: string
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            throw new BadRequestError({ code: 401, message: 'Authentication failed. Token missing.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as DecodedToken

        const userRepo = new UserRepository();
        const user = await userRepo.readOne(decoded.id)

        if (!user) {
            throw new BadRequestError({ code: 401, message: 'Authentication failed. User not found.' })
        }

        req.user = user
        req.token = token
        next()
    } catch (error) {
        throw new BadRequestError({ code: 401, message: (error as any).message })
    }
}

export default auth