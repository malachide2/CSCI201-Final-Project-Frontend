import { Card } from './ui/card';
import { Badge } from './ui/badge';
import StarRating from './StarRating';
import { Hike } from '../types';
import { MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HikeCardProps {
  hike: Hike;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Hard: 'bg-orange-100 text-orange-800 border-orange-300',
  Expert: 'bg-red-100 text-red-800 border-red-300'
};

export default function HikeCard({ hike }: HikeCardProps) {
  const navigate = useNavigate();
  
  // Create a simple SVG placeholder as data URI (gray background with "No Image" text)
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

  const imageUrl = hike.images && hike.images.length > 0 ? hike.images[0] : placeholderImage;

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={() => navigate(`/hike/${hike.id}`)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={hike.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            // Fallback to data URI if image fails to load
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className={difficultyColors[hike.difficulty]}>
            {hike.difficulty}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{hike.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="line-clamp-1">{hike.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <StarRating rating={hike.averageRating} readonly size={18} />
            <span className="ml-2 text-sm text-muted-foreground">
              ({hike.totalRatings})
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp size={16} className="mr-1" />
            <span>{hike.length} mi</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {hike.description}
        </p>
      </div>
    </Card>
  );
}

