'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { StarRating } from '../../components/star-rating';
import Image from 'next/image';

interface Feedback {
  nome: string;
  mensagem: string;
  rating: number;
  data: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [nome, setNome] = useState<string>('');
  const [mensagem, setMensagem] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nome.trim() || rating === 0) {
      alert('Por favor, preencha o nome e dê uma avaliação.');
      return;
    }

    const newFeedback: Feedback = {
      nome: nome.trim(),
      mensagem: mensagem.trim(),
      rating: rating,
      data: new Date().toLocaleString('pt-BR'),
    };

    setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedback]);

    setNome('');
    setMensagem('');
    setRating(0);
    alert('Seu feedback foi salvo com sucesso!');
  };

  const renderStars = (count: number) => {
    const fullStars = '★'.repeat(count);
    const emptyStars = '☆'.repeat(5 - count);
    return `${fullStars}${emptyStars}`;
  };

  return (
    <main className="container mx-auto p-4 md:p-8 mt-8 text-black dark:text-white focus-outline:none" tabIndex={-1} id="main-content" >
      <section id="feedbacks-section" className="mb-10">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">Feedbacks Enviados</h2>
        <div id="feedbacks-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.length === 0 ? (
            <p className="col-span-full text-center text-gray-700 dark:text-gray-300">Nenhum feedback enviado ainda.</p>
          ) : (
            feedbacks.map((feedback, index) => (
              <div key={index} className="feedback bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start">
                <div className="feedback-card-header flex items-center mb-4">
                  <Image width={0} height={0} sizes='100vw' src="/user_placeholder.png" alt={`Foto de ${feedback.nome}`} className="w-12 h-12 rounded-full mr-4 object-cover border border-gray-200 dark:border-gray-700" />
                  <div className="feedback-card-info">
                    <h4 className="text-lg font-semibold text-black dark:text-white">{feedback.nome}</h4>
                    <p className="feedback-card-date text-sm text-gray-500 dark:text-gray-400">{feedback.data}</p>
                    <p className="feedback-card-rating text-yellow-500 text-xl">
                      {renderStars(feedback.rating)}
                    </p>
                  </div>
                </div>
                <p className="feedback-card-message text-gray-700 dark:text-gray-300 flex-grow">
                  {feedback.mensagem ? feedback.mensagem : 'Nenhuma mensagem.'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">Deixe seu feedback</h1>
        <form onSubmit={handleSubmit} id="feedback-form">
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="mensagem" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Mensagem (Opcional):
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={5}
              value={mensagem}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMensagem(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div className="rating-container mb-6 text-center">
            <h3 className="text-xl font-bold text-black dark:text-white mb-3">📢 Sua Avaliação</h3>
            <StarRating initialRating={rating} onRatingChange={handleRatingChange} />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}