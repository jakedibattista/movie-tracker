import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import MovieDetails from './pages/MovieDetails';
import { WatchlistProvider } from './context/WatchlistContext';
import { RatingsProvider } from './context/RatingsContext';

function App() {
  return (
    <RatingsProvider>
      <WatchlistProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/movie/:movieId" element={<MovieDetails />} />
              </Routes>
            </main>
          </div>
        </Router>
      </WatchlistProvider>
    </RatingsProvider>
  );
}

export default App; 