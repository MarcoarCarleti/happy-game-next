 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
  
 const firebaseConfig = {
  apiKey: "AIzaSyDVaSFD_SESmW1C3OFn7-Ih9AM2RXDLMdk",
  authDomain: "happy-game-46b95.firebaseapp.com",
  projectId: "happy-game-46b95",
  storageBucket: "happy-game-46b95.firebasestorage.app",
  messagingSenderId: "886030662414",
  appId: "1:886030662414:web:c8a2cf23b2d66fd499f55f",
  measurementId: "G-5BS993VDV0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);