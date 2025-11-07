"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    mensagem: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Email enviado com sucesso!");
    console.log("Dados do formulário enviados:", formData);

    setFormData({
      nome: "",
      email: "",
      mensagem: "",
    });
  };

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8 text-black dark:text-white">
      <h1 className="text-4xl font-bold text-black dark:text-white mb-6 text-center">
        Contato
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="mensagem"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Mensagem:
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={5}
            value={formData.mensagem}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}