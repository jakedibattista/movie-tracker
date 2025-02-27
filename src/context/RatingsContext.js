import { createContext, useContext, useState, useEffect } from 'react';

const RatingsContext = createContext();

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem('movieRatings');
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  useEffect(() => {
    localStorage.setItem('movieRatings', JSON.stringify(ratings));
  }, [ratings]);

  const rateMovie = (movieId, rating) => {
    setRatings(prev => {
      const newRatings = { ...prev };
      if (rating === null) {
        // Remove the rating if null
        delete newRatings[movieId];
      } else {
        // Set the new rating
        newRatings[movieId] = rating;
      }
      return newRatings;
    });
  };

  const getUserRating = (movieId) => {
    return ratings[movieId] || null;
  };

  return (
    <RatingsContext.Provider value={{ ratings, rateMovie, getUserRating }}>
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
} 