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
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
          }}
        />
        
        {/* Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-black/75 p-4 text-white transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-full flex flex-col">
            <p className="text-sm line-clamp-6">{movie.overview || 'No description available.'}</p>
            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm">
                <span>{movie.release_date?.split('-')[0]}</span>
                <span className="flex items-center">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Button - Now positioned above the overlay */}
        <button
          onClick={handleWatchlistClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/75 transition-colors duration-200 z-10"
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {inWatchlist ? (
            <BookmarkSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <BookmarkOutline className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <h2 className="font-medium text-gray-900 line-clamp-1 mb-2">
          {movie.title}
        </h2>
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center justify-between"
        >
          <span className="text-sm text-gray-500">Your Rating:</span>
          <RatingStars
            rating={userRating}
            onRate={(rating) => rateMovie(movie.id, rating)}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

export default MovieCard; 