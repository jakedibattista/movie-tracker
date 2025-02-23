import { useState, useEffect } from 'react';
import { useRatings } from '../../context/RatingsContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import { getMovieDetails } from '../../services/movieApi';

function MyRatings() {
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'date'
  const { ratings } = useRatings();

  useEffect(() => {
    const fetchRatedMovies = async () => {
      setLoading(true);
      try {
        // Fetch details for all rated movies
        const moviePromises = Object.entries(ratings).map(async ([movieId, rating]) => {
          const movieDetails = await getMovieDetails(movieId);
          return { ...movieDetails, userRating: rating };
        });

        const movies = await Promise.all(moviePromises);
        
        // Sort movies based on selection
        const sortedMovies = [...movies].sort((a, b) => {
          if (sortBy === 'rating') {
            return b.userRating - a.userRating;
          }
          // Sort by release date if not sorting by rating
          return new Date(b.release_date) - new Date(a.release_date);
        });

        setRatedMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching rated movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatedMovies();
  }, [ratings, sortBy]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">My Rated Movies</h1>
        
        <div className="flex justify-between items-center mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="date">Sort by Release Date</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : ratedMovies.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          You haven't rated any movies yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ratedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRatings; 