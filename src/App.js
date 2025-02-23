import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Router future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/movie/:movieId" element={<MovieDetails />} />
              </Routes>
            </div>
          </div>
        </Router>
      </WatchlistProvider>
    </RatingsProvider>
  );
}

export default App;
