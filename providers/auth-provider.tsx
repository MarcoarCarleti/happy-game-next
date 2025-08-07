'use client'

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
 
const AuthContext = createContext({
    currentUser: null,
    loading: true,
    signup: (email: string, password: string) => Promise.resolve(),
    login: (email: string, password: string) => Promise.resolve(),
    loginWithGoogle: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user as any);
      setLoading(false);
    });

     return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup: (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
    login: (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
  };

   return (
    <AuthContext.Provider value={value as any}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
