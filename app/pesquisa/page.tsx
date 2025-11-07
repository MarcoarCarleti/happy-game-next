'use client'; 

import { useState, useEffect, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number; 
}

interface RAWGResponse {
  results: Game[];
}

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY; 

export default function PesquisaPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const data: RAWGResponse = await response.json();
        setGames(data.results);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
        setError('Erro ao carregar jogos. Tente novamente mais tarde.');
        setGames([]); 
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      if (searchTerm.length > 1 || searchTerm.length === 0) {
        fetchGames(searchTerm);
      }
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); 

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8 text-black dark:text-white">
      <h1 className="text-4xl font-bold text-black dark:text-white mb-6 text-center">🔍 Pesquisar Jogos</h1>
      <input
        type="text"
        id="searchInput"
        placeholder="Digite o nome do jogo..."
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="w-full max-w-xl mx-auto block p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg mb-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      />
      <div id="games-list" className="games-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-700 dark:text-gray-300 text-xl font-semibold">
            Carregando...
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-600 dark:text-red-400 text-xl font-semibold">
            {error}
          </div>
        ) : games.length === 0 ? (
          <div className="col-span-full text-center text-gray-700 dark:text-gray-300 text-xl font-semibold">
            Nenhum jogo encontrado 😢
          </div>
        ) : (
          games.map((game) => (
            <div key={game.id} className="game-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <Image width={0} height={0} sizes='100vw' src={game.background_image} alt={game.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{game.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Nota: ⭐ {game.rating}</p>
                <Link href={`/detalhes/${game.id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center transition-colors duration-200">
                  Ver Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}