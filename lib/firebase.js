import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChN4ytdw5TOY_dxP3px3kBdMx1B5Fnyaw",
  authDomain: "gameover-44975.firebaseapp.com",
  projectId: "gameover-44975",
  storageBucket: "gameover-44975.firebasestorage.app",
  messagingSenderId: "857787727900",
  appId: "1:857787727900:web:75362e3e6793edfe5b9fd9",
  measurementId: "G-416T7RCCTZ"
};

// Inicializa Firebase solo si no ha sido inicializado antes (truco para Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializamos y exportamos la base de datos (Firestore)
export const db = getFirestore(app);