'use client';

import React, { useState, useEffect } from 'react';

interface StarRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void; 
  gameId?: string; 
}

export const StarRating: React.FC<StarRatingProps> = ({ initialRating = 0, onRatingChange, gameId }) => {
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (gameId) {
      const storedRating = localStorage.getItem(`rating-${gameId}`);
      if (storedRating) {
        setCurrentRating(parseInt(storedRating));
      }
    }
  }, [gameId]);

  useEffect(() => {
    setCurrentRating(initialRating);
  }, [initialRating]);

  const handleClick = (value: number) => {
    setCurrentRating(value);
    setHoverRating(0); 

    if (gameId) {
      localStorage.setItem(`rating-${gameId}`, value.toString());
      console.log(`Rating ${value} saved for game ID: ${gameId}`);
     
    }

    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex text-3xl text-gray-400">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`cursor-pointer transition-colors duration-200 ${
            (hoverRating || currentRating) >= value ? 'text-yellow-400' : 'text-gray-400'
          }`}
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleClick(value)}
        >
          ★
        </span>
      ))}
    </div>
  );
};