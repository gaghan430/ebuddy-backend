import BadRequestError from "@entities/bad-request.error";
import {
    CollectionReference, DocumentData, DocumentReference,
    DocumentSnapshot, Firestore
} from "@google-cloud/firestore";
import { v4 as uuidv4 } from 'uuid';

export interface IFirestoreRepository {
    create(object: DocumentData): Promise<DocumentReference>;
    readOne(id: string): Promise<DocumentReference>;
    readAll(): Promise<DocumentReference[]>;
    update(id: string, object: DocumentData): Promise<DocumentReference>;
    delete(id: string): Promise<DocumentReference>;
}

export default class FirestoreRepository implements IFirestoreRepository {
    public readonly collection: CollectionReference;

    constructor(db: Firestore, collectionName: string) {
        this.collection = db.collection(collectionName);
    }

    public async create(object: DocumentData): Promise<DocumentReference> {
        try {
            const id = uuidv4()
            const ref: DocumentReference = this.collection.doc(id);
            await ref.set({ ...object, id });

            return ref;
        } catch {
            throw new BadRequestError({ message: "Could not create object" });
        }
    }

    public async readOne(id: string): Promise<DocumentReference> {
        try {
            return await this.collection.doc(id);
        } catch {
            throw new BadRequestError({ message: "Could not read object" });
        }
    }

    public async readAll(): Promise<DocumentReference[]> {
        try {
            return await this.collection.listDocuments();
        } catch {
            throw new BadRequestError({ message: "Could not read all objects" });
        }
    }

    public async update(id: string, object: DocumentData): Promise<DocumentReference> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            const snap: DocumentSnapshot = await ref.get();
            if (!snap.exists) {
                return ref;
            }
            await ref.update(object);
            return ref;
        } catch {
            throw new BadRequestError({ message: "Could not update object" });
        }
    }

    public async delete(id: string): Promise<DocumentReference> {
        try {
            const ref: DocumentReference = this.collection.doc(id);
            await ref.delete();
            return ref;
        } catch {
            throw new BadRequestError({ message: "Could not remove object" });
        }
    }
}