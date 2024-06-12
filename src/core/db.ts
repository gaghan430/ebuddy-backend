import { firebase } from "@config/firebase.config";
import * as admin from "firebase-admin";

if (process.env.NODE_ENV === 'production') {
    const key = require("./serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(key),
        databaseURL: firebase.db,
    });
} else {
    admin.initializeApp({ projectId: firebase.project })
}

const db: FirebaseFirestore.Firestore = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;