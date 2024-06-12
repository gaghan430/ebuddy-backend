import db from "@core/db";
import BadRequestError from "@entities/bad-request.error";
import { DocumentData, DocumentSnapshot } from "@google-cloud/firestore";
import FirestoreRepository from "./firestore.repository";

export default class BaseRepository {

    protected repository: FirestoreRepository;

    constructor(collection: string) {
        this.repository = new FirestoreRepository(db, collection);
    }

    public async create(payload: any): Promise<DocumentData | undefined> {
        if (payload == null) {
            throw new BadRequestError({ code: 400, message: "The body was empty or undefined" });
        }

        const value = await this.repository.create(payload)
        const doc = await value.get()

        return doc.data() ? doc.data() : undefined;
    }

    public async readOne(id: any): Promise<DocumentData | undefined> {
        if (id == null) {
            throw new BadRequestError({ code: 400, message: "The id was empty or undefined" });
        }

        const value = await this.repository.readOne(id)
        const doc = await value.get()

        return doc.data() ? doc.data() : undefined;
    }

    public async readAll(): Promise<DocumentData[]> {
        const list = await this.repository.readAll();
        const allPromises: Array<Promise<DocumentSnapshot>> = new Array<Promise<DocumentSnapshot>>();
        list.forEach(async (item) => {
            allPromises.push(item.get());
        });

        const promises = await Promise.all(allPromises);
        const dataArray: DocumentData[] = new Array<DocumentData>();
        promises.forEach(async (promise) => {
            dataArray.push(promise.data() as DocumentData);
        });

        return dataArray;
    }

    public async update(id: any, payload: any): Promise<DocumentData | undefined> {
        if (payload == null) {
            throw new BadRequestError({ code: 400, message: "The payload was empty or undefined" });
        }

        if (id == null) {
            throw new BadRequestError({ code: 400, message: "The id was empty or undefined" });
        }

        const value = await this.repository.update(id, payload)
        const doc = await value.get()

        return doc.data() ? doc.data() : undefined;
    }

    public async delete(id: any): Promise<DocumentData | undefined> {
        if (id == null) {
            throw new BadRequestError({ code: 400, message: "The id was empty or undefined" });
        }

        await this.repository.delete(id);
        return;
    }
}