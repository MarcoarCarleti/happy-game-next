import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
}

interface RAWGResponse {
  results: Game[];
}

interface NewGameVideo {
  id: number;
  name: string;
  path: string;
}

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

async function fetchReviews(): Promise<Game[]> {
  if (!API_KEY) {
    console.error("RAWG_API_KEY is not defined in environment variables.");
    return [];
  }
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch game reviews: ${response.statusText}`);
    }
    const data: RAWGResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching game reviews:", error);
    return [];
  }
}

async function fetchNewGames(): Promise<NewGameVideo[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/videos.json`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch new games: ${response.statusText}`);
    }
    const data: NewGameVideo[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching new game videos:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Happy Game - Home",
  description:
    "Bem-vindo ao Happy Game! Encontre reviews dos melhores jogos e os últimos lançamentos.",
};

export default async function HomePage() {
  const [reviews, newGames] = await Promise.all([
    fetchReviews(),
    fetchNewGames(),
  ]);

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
        Bem-vindo ao Happy Game!
      </h1>
      <p className="text-xl text-gray-600 mb-10 text-center">
        Confira reviews dos melhores jogos do momento e os novos lançamentos.
      </p>

      <section id="novos-lancamentos" className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Acompanhe os novos lançamentos
        </h2>
        <div
          id="novos-lancamentos-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newGames.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">
              Não foi possível carregar os novos lançamentos. Tente novamente
              mais tarde.
            </p>
          ) : (
            newGames.map((game, i) => (
              <div
                key={i}
                className="game-card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <video controls className="w-full h-48 object-cover">
                  <source src={game.path} type="video/mp4" />
                  Seu navegador não suporta o formato de vídeo.
                </video>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600">Confira o novo lançamento!</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="reviews-section">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reviews
        </h2>
        <div
          id="games"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {reviews.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              <p>
                Carregando Reviews ou erro ao carregar. Tente novamente mais
                tarde.
              </p>
            </div>
          ) : (
            reviews.map((game) => (
              <div
                key={game.id}
                className="game-card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 mb-4">Nota: ⭐ {game.rating}</p>
                  <Link
                    href={`/detalhes/${game.id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center transition-colors duration-200"
                  >
                    Ver Review
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
