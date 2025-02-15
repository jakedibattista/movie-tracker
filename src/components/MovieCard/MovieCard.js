import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useWatchlist } from '../../context/WatchlistContext';
import { useRatings } from '../../context/RatingsContext';
import RatingStars from '../RatingStars/RatingStars';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const { getUserRating, rateMovie } = useRatings();
  const userRating = getUserRating(movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
          }}
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-75 p-4 pt-14 text-white overflow-y-auto transition-opacity duration-300">
            <h3 className="font-bold mb-2">{movie.title}</h3>
            <p className="text-sm">{movie.overview || 'No description available.'}</p>
          </div>
        )}
        <button
          onClick={handleWatchlistClick}
          className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200 z-10"
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {inWatchlist ? (
            <BookmarkSolid className="h-5 w-5 text-yellow-500" />
          ) : (
            <BookmarkOutline className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">{movie.title}</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </p>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-600 text-sm ml-1">
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-600">Your Rating:</span>
            <RatingStars
              rating={userRating}
              onRate={(rating) => rateMovie(movie.id, rating)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard; 