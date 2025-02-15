import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import { getMovieDetails, getMovieRecommendations } from '../../services/movieApi';
import MovieCard from '../../components/MovieCard/MovieCard';
import { useWatchlist } from '../../context/WatchlistContext';
import { useRatings } from '../../context/RatingsContext';
import RatingStars from '../../components/RatingStars/RatingStars';

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { getUserRating, rateMovie } = useRatings();
  const userRating = getUserRating(movie?.id);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieData, recommendationsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieRecommendations(movieId)
        ]);
        setMovie(movieData);
        setRecommendations(recommendationsData);
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {movie.release_date?.split('-')[0]}
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {movie.runtime} min
              </span>
              <span className="flex items-center">
                <StarIcon className="h-4 w-4 mr-1" />
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm mt-2">
              <div className="flex items-center gap-2">
                <span className="text-white">Your Rating:</span>
                <RatingStars
                  rating={userRating}
                  onRate={(rating) => rateMovie(movie.id, rating)}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <p className="text-gray-700 mb-4">{movie.overview}</p>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
              className={`px-4 py-2 rounded-lg ${
                inWatchlist
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white ml-4`}
            >
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>

          {recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.slice(0, 4).map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails; 