# MovieTracker

A React-based web application for discovering, tracking, and rating movies. Built with React, Tailwind CSS, and the TMDB API.

## Live Demo

Visit the live application at: [MovieTracker on Vercel](https://movie-tracker-flax.vercel.app/)

## Features

- **Browse Movies**: Discover the latest movies with infinite scroll
- **Search**: Find specific movies with real-time search
- **Watchlist**: Save movies to watch later
- **Rating System**: Rate movies and keep track of your ratings
- **Genre Filtering**: Filter movies by genre
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Heroicons
- TMDB API
- Local Storage for data persistence
- Vercel for hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jakedibattista/MovieTracker.git
cd MovieTracker
```

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add your TMDB API key:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server:

```bash
npm start
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
movie-tracker/
├── src/
│   ├── components/
│   │   ├── MovieCard/
│   │   ├── Navbar/
│   │   └── RatingStars/
│   ├── context/
│   │   ├── WatchlistContext.js
│   │   └── RatingsContext.js
│   ├── pages/
│   │   ├── Home/
│   │   ├── Watchlist/
│   │   ├── MyRatings/
│   │   └── MovieDetails/
│   ├── services/
│   │   └── movieApi.js
│   ├── App.js
│   └── index.js
└── public/
```

## Features in Detail

### Home Page
- Displays recent movies
- Infinite scroll for loading more movies
- Genre filter buttons
- Search functionality
- Movie cards with hover effects

### Watchlist
- Add/remove movies from watchlist
- Sort by different criteria
- Filter by genres
- Persistent storage

### My Ratings
- View all rated movies
- Sort by rating or release date
- Unrate movies by clicking the same star
- Persistent ratings

### Movie Details
- Comprehensive movie information
- Add to watchlist option
- Rating functionality
- Similar movie recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their excellent API
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Heroicons](https://heroicons.com/) for the icons
