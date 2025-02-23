import axios from 'axios';

// Use the API key directly for now
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
console.log('API Key length:', API_KEY?.length); // Check the length
console.log('API Key first 5 chars:', API_KEY?.substring(0, 5)); // Check the start
console.log('API Key last 5 chars:', API_KEY?.substring(API_KEY.length - 5)); // Check the end

const BASE_URL = 'https://api.themoviedb.org/3';

// Add axios default config
axios.defaults.params = {};
axios.defaults.params['api_key'] = API_KEY;

// Get current date and one year ago
const currentDate = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

// Format dates for API (YYYY-MM-DD)
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Add sort parameter to the API call
const sortOptions = {
  popularity: 'popularity.desc',
  release: 'primary_release_date.desc',
  rating: 'vote_average.desc'
};

// Test the full URL being generated
const testUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
console.log('Test URL:', testUrl);

export const getPopularMovies = async (page = 1, sortBy = 'popularity') => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        language: 'en-US',
        sort_by: sortOptions[sortBy],
        page: page,
        primary_release_date_gte: formatDate(oneYearAgo),
        primary_release_date_lte: formatDate(currentDate),
        region: 'US',
        with_release_type: '2|3'
      }
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    return { results: [], total_pages: 0 };
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    // Also add date filtering to search
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&primary_release_date.gte=${formatDate(oneYearAgo)}&primary_release_date.lte=${formatDate(currentDate)}&region=US`
    );
    console.log('Search movies response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0 };
  }
};

export const getGenres = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieRecommendations = async (movieId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return [];
  }
}; 