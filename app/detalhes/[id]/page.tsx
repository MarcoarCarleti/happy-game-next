"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { StarRating } from "@/components/star-rating";
import Image from "next/image";

interface GameRating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

interface PlatformRequirements {
  minimum?: string;
  recommended?: string;
}

interface PlatformDetail {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  requirements: PlatformRequirements;
}

interface GameGenre {
  id: number;
  name: string;
  slug: string;
}

interface GameData {
  id: number;
  name: string;
  description: string;
  background_image: string;
  rating: number;
  metacritic: number | null;
  genres: GameGenre[];
  platforms: PlatformDetail[];
  ratings: GameRating[];
}

interface DetalhesPageProps {
  params: Promise<{
    id: string;
  }>;
}

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

async function getGameDetails(gameId: string): Promise<GameData | null> {
  if (!API_KEY) {
    console.error("RAWG_API_KEY is not defined in environment variables.");
    return null;
  }
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch game details: ${response.statusText}`);
    }

    const data: GameData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
}

export default function DetalhesPage({ params }: DetalhesPageProps) {
  const { id: gameId } = use(params);
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [savedUserRatingText, setSavedUserRatingText] = useState<string>("");

  useEffect(() => {
    const fetchAndSetGame = async () => {
      setLoading(true);
      setError(null);

      const fetchedGame = await getGameDetails(gameId);
      if (fetchedGame) {
        setGame(fetchedGame);
        const storedRating = localStorage.getItem(`rating-${gameId}`);
        if (storedRating) {
          const ratingNum = parseInt(storedRating);
          setUserRating(ratingNum);
          setSavedUserRatingText(`Sua Nota: ${ratingNum}/5`);
        }
      } else {
        setError("Jogo não encontrado ou erro ao carregar detalhes.");

        notFound();
      }
      setLoading(false);
    };

    fetchAndSetGame();
  }, [gameId]);

  const handleSaveRating = (rating: number) => {
    if (rating < 1 || rating > 5) {
      alert("Por favor, selecione uma nota entre 1 e 5.");
      return;
    }
    localStorage.setItem(`rating-${gameId}`, rating.toString());
    setSavedUserRatingText(`Sua Nota: ${rating}/5`);
    alert("Nota salva com sucesso!");
  };

  if (loading) {
    return (
      <main className="container mx-auto p-4 md:p-8 mt-8 flex justify-center items-center h-96">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregando...</div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="container mx-auto p-4 md:p-8 mt-8 text-center">
        <p className="text-red-600 dark:text-red-400 text-xl font-semibold">
          {error || "Jogo não encontrado!"}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          🔙 Voltar
        </button>
      </main>
    );
  }

  const metacritic = game.metacritic ? `${game.metacritic}/100` : "N/A";
  const userScore = game.rating ? `${game.rating}/5` : "N/A";

  const getRatingEmoji = (title: string) => {
    switch (title) {
      case "exceptional":
        return "🔥";
      case "recommended":
        return "👍";
      case "meh":
        return "😐";
      case "skip":
        return "❌";
      default:
        return "⭐";
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8 text-black dark:text-white focus-outline:none" tabIndex={-1} id="main-content" >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
        <Image
          src={game.background_image}
          alt={game.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-80 object-contain rounded-lg mb-6"
          unoptimized={true}
        />
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {game.name}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          <strong className="font-semibold">Nota RAWG:</strong> ⭐ {userScore}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          <strong className="font-semibold">Metacritic:</strong> 🎯 {metacritic}
        </p>
        <p
          className="text-gray-600 dark:text-gray-400 mb-6"
          dangerouslySetInnerHTML={{ __html: game.description }}
        />

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          <strong className="font-semibold">🎮 Gêneros:</strong>{" "}
          {game.genres.map((g) => g.name).join(", ")}
        </p>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            📊 Avaliações Detalhadas
          </h3>
          {game.ratings.length > 0 ? (
            <ul className="space-y-2">
              {game.ratings.map((rating) => (
                <li key={rating.id} className="text-gray-700 dark:text-gray-300">
                  {getRatingEmoji(rating.title)}{" "}
                  <strong className="capitalize">{rating.title}:</strong>{" "}
                  {rating.percent.toFixed(1)}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Sem avaliações detalhadas.</p>
          )}
        </div>

        <div className="mb-8 overflow-x-auto">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            🕹 Plataformas
          </h3>
          <table className="min-w-full bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-200 dark:bg-gray-900">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Plataforma
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Requisitos Mínimos
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Requisitos Recomendados
                </th>
              </tr>
            </thead>
            <tbody>
              {game.platforms.map((platformData) => (
                <tr
                  key={platformData.platform.id}
                  className="border-b last:border-b-0 border-gray-200 dark:border-gray-600 even:bg-gray-100 dark:even:bg-gray-800"
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-white font-medium">
                    {platformData.platform.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                    {platformData.requirements?.minimum ||
                      "Sem requisitos mínimos disponíveis."}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                    {platformData.requirements?.recommended ||
                      "Sem requisitos recomendados disponíveis."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rating-container bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-inner flex flex-col items-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            📢 Sua Avaliação
          </h3>
          <StarRating
            initialRating={userRating}
            onRatingChange={setUserRating}
            gameId={String(gameId)}
          />
          <button
            onClick={() => handleSaveRating(userRating)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors duration-200"
          >
            Salvar Nota
          </button>
          <p
            id="saved-rating"
            className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
            {savedUserRatingText}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-200 text-lg dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          🔙 Voltar
        </button>
      </div>
    </main>
  );
}