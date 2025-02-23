import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookmarkIcon, StarIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              MovieTracker
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              to="/watchlist" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/watchlist' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Watchlist
            </Link>
            <Link 
              to="/ratings" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/ratings' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <StarIcon className="h-4 w-4 mr-2" />
              My Ratings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
