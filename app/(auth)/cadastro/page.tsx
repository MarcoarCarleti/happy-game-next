"use client";

import { useAuth } from "@/providers/auth-provider";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, login } = useAuth();
  const router = useRouter();

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "O formato do e-mail é inválido.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "E-mail ou senha incorretos.";
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso.";
      case "auth/weak-password":
        return "A senha precisa ter no mínimo 6 caracteres.";
      case "auth/popup-closed-by-user":
        return "A janela de login com Google foi fechada.";
      default:
        return "Ocorreu um erro. Tente novamente.";
    }
  };

  const handleSignup = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      await signup(email, password);
      await login(email, password);
      router.push("/");
    } catch (err: FirebaseError | unknown) {
      if (err instanceof FirebaseError) {
        setError(getFriendlyErrorMessage(err.code));
        return
      }

      setError("Ocorreu um erro. Tente novamente.")
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //     if (isSubmitting) return;
  //     setIsSubmitting(true);
  //     setError('');
  //     try {
  //         await loginWithGoogle();
  //     } catch (err) {
  //         setError(getFriendlyErrorMessage(err.code));
  //     } finally {
  //         setIsSubmitting(false);
  //     }
  // };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Crie sua Conta
        </h1>

        {error && (
          <p className="p-3 text-center text-sm font-medium text-red-800 bg-red-100 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email-signup"
              className="text-sm font-medium text-gray-600"
            >
              E-mail
            </label>
            <input
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password-signup"
              className="text-sm font-medium text-gray-600"
            >
              Senha
            </label>
            <input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSignup}
            disabled={isSubmitting}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors duration-300"
          >
            {isSubmitting ? "Criando..." : "Criar Conta"}
          </button>
        </div>

        {/* <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative px-2 bg-white text-sm text-gray-500">Ou crie com</div>
            </div>

            <button onClick={handleGoogleLogin} disabled={isSubmitting} className="w-full flex items-center justify-center px-4 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition-colors duration-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                Google
            </button> */}
        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link
            href={"/login"}
            className="font-medium text-blue-600 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
