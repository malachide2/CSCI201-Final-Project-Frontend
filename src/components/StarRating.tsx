import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 20,
  readonly = false,
  showValue = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayRating >= star;
        const halfFilled = displayRating >= star - 0.5 && displayRating < star;

        return (
          <div
            key={star}
            className={`relative ${!readonly ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Half star click area */}
            <div
              className="absolute inset-0 w-1/2 z-10"
              onClick={() => handleClick(star - 0.5)}
              onMouseEnter={() => handleMouseEnter(star - 0.5)}
            />
            {/* Full star click area */}
            <div
              className="absolute inset-0 left-1/2 w-1/2 z-10"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
            />
            
            {/* Background star */}
            <Star
              size={size}
              className="text-gray-300"
              fill="currentColor"
            />
            
            {/* Foreground star (filled) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: filled ? '100%' : halfFilled ? '50%' : '0%'
              }}
            >
              <Star
                size={size}
                className="text-yellow-500"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

