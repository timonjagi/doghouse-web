// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { firebaseConfig } from "./config";

// Initialize Firebase for server-side rendering
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const fireStore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { fireStore, auth, storage };
