import axios from 'axios';

// Use the API key directly for now
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
console.log('API Key:', API_KEY);
const BASE_URL = 'https://api.themoviedb.org/3';

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

export const getPopularMovies = async (page = 1, sortBy = 'popularity') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sortOptions[sortBy]}&page=${page}&primary_release_date.gte=${formatDate(oneYearAgo)}&primary_release_date.lte=${formatDate(currentDate)}&region=US&with_release_type=2|3`
    );
    console.log('Recent movies response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent movies:', error);
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