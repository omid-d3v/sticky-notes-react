import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Reading Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate environment variables
if (!firebaseConfig.apiKey) {
    throw new Error("Firebase environment variables are not properly set. Please check your .env file.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);