import { useState, useEffect } from 'react';
import { useWatchlist } from '../../context/WatchlistContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import { getGenres } from '../../services/movieApi';
import { useRatings } from '../../context/RatingsContext';

function Watchlist() {
  const { watchlist } = useWatchlist();
  const [sortBy, setSortBy] = useState('dateAdded');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sortedAndFilteredMovies, setSortedAndFilteredMovies] = useState([]);
  const { getUserRating } = useRatings();

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    let filtered = [...watchlist];

    // Apply genre filtering
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie => 
        movie.genre_ids?.some(id => selectedGenres.includes(id))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case 'year':
        filtered.sort((a, b) => {
          const yearA = a.release_date?.split('-')[0] || '0';
          const yearB = b.release_date?.split('-')[0] || '0';
          return yearB.localeCompare(yearA);
        });
        break;
      case 'dateAdded':
      case 'userRating':
        break;
      default:
        // Assuming the order in watchlist array represents date added
        break;
    }

    if (sortBy === 'userRating') {
      filtered.sort((a, b) => {
        const ratingA = getUserRating(a.id) || 0;
        const ratingB = getUserRating(b.id) || 0;
        return ratingB - ratingA;
      });
    }

    setSortedAndFilteredMovies(filtered);
  }, [watchlist, sortBy, selectedGenres, getUserRating]);

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="rating">TMDB Rating</option>
            <option value="userRating">Your Rating</option>
            <option value="year">Release Year</option>
          </select>

          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedAndFilteredMovies.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          {watchlist.length === 0 
            ? 'Your watchlist is empty. Add some movies to watch later!'
            : 'No movies match your selected filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedAndFilteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist; 