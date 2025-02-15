import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getPopularMovies, searchMovies, getGenres } from '../../services/movieApi';
import MovieCard from '../../components/MovieCard/MovieCard';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchTimeout, setDebouncedSearchTimeout] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let results;
        if (searchQuery.trim()) {
          results = await searchMovies(searchQuery);
        } else {
          results = await getPopularMovies();
        }
        
        if (selectedGenres.length > 0) {
          results = results.filter(movie => 
            movie.genre_ids?.some(id => selectedGenres.includes(id))
          );
        }
        
        setMovies(results);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTimeout) {
      clearTimeout(debouncedSearchTimeout);
    }

    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    setDebouncedSearchTimeout(timeoutId);

    return () => {
      if (debouncedSearchTimeout) {
        clearTimeout(debouncedSearchTimeout);
      }
    };
  }, [searchQuery, selectedGenres, debouncedSearchTimeout]);

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
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border focus:outline-none focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
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

        <h1 className="text-3xl font-bold mb-6 text-center">
          {searchQuery ? 'Search Results' : 'Popular Movies'}
        </h1>
      </div>

      {loading && (
        <div className="text-center py-8">Loading...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">{error}</div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No movies found{selectedGenres.length > 0 ? ' matching selected genres' : ''}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home; 