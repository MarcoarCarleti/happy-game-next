"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

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
          <li>
            <Link
              href="/feedback"
              className={
                pathname === "/feedback" // Check if the current path is '/feedback'
                  ? "text-blue-400 font-bold"
                  : "hover:text-blue-400 transition-colors duration-200"
              }
            >
              Feedback
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
