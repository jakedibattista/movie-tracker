import { Link } from 'react-router-dom';
import { HomeIcon, BookmarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            MovieTracker
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link to="/watchlist" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <BookmarkIcon className="h-5 w-5 mr-1" />
              Watchlist
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 