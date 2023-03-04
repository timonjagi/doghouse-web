import admin from "firebase-admin";
import { initializeApp, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

const app = !getApps().length
  ? initializeApp({ credential: admin.credential.cert(serviceAccount) })
  : getApp();

const auth = getAuth(app);

export { auth };
