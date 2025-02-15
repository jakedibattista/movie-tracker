import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchMovies } from '../../services/movieApi';
import MovieCard from '../../components/MovieCard/MovieCard';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTimeout, setDebouncedSearchTimeout] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timeout
    if (debouncedSearchTimeout) {
      clearTimeout(debouncedSearchTimeout);
    }

    // Set new timeout to debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    setDebouncedSearchTimeout(timeoutId);
  };

  return (
    <div>
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search for movies..."
            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border focus:outline-none focus:border-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">Searching...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {!loading && !error && movies.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-600">
          No movies found matching your search.
        </div>
      )}
    </div>
  );
}

export default Search; 