"use client";

import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutIcon } from "./icons/log-out";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Pesquisa", href: "/pesquisa" },
  { label: "Contato", href: "/contato" },
  { label: "Feedback", href: "/feedback" },
];

const Header = () => {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="bg-gray-800 text-white p-4 dark:bg-gray-900 sticky top-0 z-50">
      
      {/* PASSO 1: O "SKIP LINK" 
        - Fica fora da tela (absolute -top-40)
        - Ao focar com o teclado (focus:top-4), ele aparece sobre o header.
        - Ele aponta para o ID: #main-content
      */}
      <a 
        href="#main-content" 
        className="absolute -top-40 left-4 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out z-[9999] focus:top-4"
      >
        Pular para o Conteúdo
      </a>

      <nav className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="logo">
          <Image
            width={100}
            height={40}
            src="/logo.svg"
            alt="Happy Game Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Links do Menu Desktop */}
        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  pathname === item.href
                    ? "text-blue-400 font-bold"
                    : "hover:text-blue-400 transition-colors duration-200"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botões Desktop (Tema e Auth) */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

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

        {/* Botão Hamburger (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Menu Dropdown Mobile */}
        <div
          className={`w-full md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } mt-4`}
        >
          {/* Links Mobile */}
          <ul className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "text-blue-400 font-bold block py-2"
                      : "hover:text-blue-400 transition-colors duration-200 block py-2"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-gray-700" />

          {/* Botões Mobile (Tema e Auth) */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-all w-full"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out w-full"
              >
                <LogoutIcon />
                Sair
              </button>
            ) : (
              <Link
                href={"/login"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;