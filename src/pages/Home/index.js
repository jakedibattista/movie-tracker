import { useState, useEffect, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getPopularMovies, searchMovies, getGenres } from '../../services/movieApi';
import MovieCard from '../../components/MovieCard/MovieCard';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const [yearFilter, setYearFilter] = useState('1'); // '1' for one year, '2' for two years, etc.

  // Fetch genres once on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  const fetchMovies = useCallback(async (query, pageNum) => {
    try {
      let response;
      if (query?.trim()) {
        response = await searchMovies(query, pageNum);
      } else {
        response = await getPopularMovies(pageNum);
      }
      
      let results = response.results;
      if (selectedGenres.length > 0) {
        results = results.filter(movie => 
          movie.genre_ids?.some(id => selectedGenres.includes(id))
        );
      }
      
      setMovies(prev => pageNum === 1 ? results : [...prev, ...results]);
      setHasMore(pageNum < response.total_pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedGenres]);

  // Reset and fetch when search or filters change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setLoading(true);
      fetchMovies(searchQuery, 1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedGenres, fetchMovies]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  // Fetch more movies when page changes
  useEffect(() => {
    if (page > 1) {
      fetchMovies(searchQuery, page);
    }
  }, [page, searchQuery, fetchMovies]);

  const handleGenreToggle = useCallback((genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border-0 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Genre Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenres.includes(genre.id)
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div className="mb-8">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="1">Past Year</option>
          <option value="2">Past 2 Years</option>
          <option value="5">Past 5 Years</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {searchQuery ? 'Search Results' : 'Popular Movies'}
      </h1>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Loading indicator */}
      {(loading || hasMore) && (
        <div 
          ref={loadingRef}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center py-12 text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No movies found{selectedGenres.length > 0 ? ' matching selected genres' : ''}.
        </div>
      )}
    </div>
  );
}

export default Home;
