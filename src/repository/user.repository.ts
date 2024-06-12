import BaseRepository from "./base.repository";

export default class UserRepository extends BaseRepository {
    constructor() {
        super("user")
    }


    async readyByEmail(email: string) {
        const value = await this.repository.collection.where('email', '==', email).get();

        if (!value.empty) {
            const snap = value.docs[0];
            return snap.data();
        }

        return null;
    }
}