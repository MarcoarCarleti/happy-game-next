"use client";

import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutIcon } from "./icons/log-out";

const Header = () => {
  const pathname = usePathname();

  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="logo">
          <Image
            width={100}
            height={10}
            src="/logo.svg"
            alt="Happy Game Logo"
            className="h-10"
          />
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-blue-400 font-bold"
                  : "hover:text-blue-400 transition-colors duration-200" // Inactive classes
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/pesquisa"
              className={
                pathname === "/pesquisa" // Check if the current path is '/pesquisa'
                  ? "text-blue-400 font-bold"
                  : "hover:text-blue-400 transition-colors duration-200"
              }
            >
              Pesquisa
            </Link>
          </li>
          <li>
            <Link
              href="/contato"
              className={
                pathname === "/contato" // Check if the current path is '/contato'
                  ? "text-blue-400 font-bold"
                  : "hover:text-blue-400 transition-colors duration-200"
              }
            >
              Contato
            </Link>
          </li>
        </ul>

         <div className="flex items-center">
          {currentUser ? (
            <button
              onClick={() => logout()}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <LogoutIcon />
              Sair
            </button>
          ) : (
            <Link
              href={"/login"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
