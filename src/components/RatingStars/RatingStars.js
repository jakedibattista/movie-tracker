import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

function RatingStars({ rating, onRate, size = "small", readonly = false }) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate(star)}
          disabled={readonly}
          className={`${!readonly && 'hover:scale-110'} transition-transform`}
        >
          {star <= (rating || 0) ? (
            <StarSolid 
              className={`${
                size === "small" ? "h-4 w-4" : "h-5 w-5"
              } text-yellow-400`}
            />
          ) : (
            <StarOutline 
              className={`${
                size === "small" ? "h-4 w-4" : "h-5 w-5"
              } text-gray-300`}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default RatingStars; 