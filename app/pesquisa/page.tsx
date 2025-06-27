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

    // Initial fetch or fetch when search term changes
    const handler = setTimeout(() => {
      // Only fetch if searchTerm has a value or it's the initial load (empty query)
      if (searchTerm.length > 1 || searchTerm.length === 0) {
        fetchGames(searchTerm);
      }
    }, 500); // 500ms debounce

    // Clear timeout on component unmount or searchTerm change
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Re-run effect when searchTerm changes

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">🔍 Pesquisar Jogos</h1>
      <input
        type="text"
        id="searchInput"
        placeholder="Digite o nome do jogo..."
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="w-full max-w-xl mx-auto block p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg mb-8"
      />
      <div id="games-list" className="games-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-600 text-xl font-semibold">
            Carregando...
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-600 text-xl font-semibold">
            {error}
          </div>
        ) : games.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 text-xl font-semibold">
            Nenhum jogo encontrado 😢
          </div>
        ) : (
          games.map((game) => (
            <div key={game.id} className="game-card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <Image width={0} height={0} sizes='100vw' src={game.background_image} alt={game.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">Nota: ⭐ {game.rating}</p>
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