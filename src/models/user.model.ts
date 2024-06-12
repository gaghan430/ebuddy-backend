import { Exclude, instanceToPlain } from "class-transformer";

export class UserModel {
    id: string;

    email: string;

    name: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    toJSON() {
        return instanceToPlain(this);
    }
}