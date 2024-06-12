import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterInput {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

    @IsString()
    @IsNotEmpty()
    public name: string;
}

export class LoginInput {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}