import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import StarRating from './StarRating';
import { Button } from './ui/button';
import { ThumbsUp } from 'lucide-react';
import { Rating } from '../types';
import { users } from '../data/dummy-data';
import { useAuth } from '../contexts/AuthContext';

interface CommentCardProps {
  rating: Rating;
  onUpvote: (ratingId: string) => void;
}

export default function CommentCard({ rating, onUpvote }: CommentCardProps) {
  const { user: currentUser } = useAuth();
  const user = users.find(u => u.id === rating.userId);
  const hasUpvoted = currentUser ? rating.upvotedBy.includes(currentUser.id) : false;

  if (!user) return null;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={user.profileImage} alt={user.username} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(rating.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <StarRating rating={rating.rating} readonly size={16} />
          </div>

          <p className="text-sm mb-3">{rating.comment}</p>

          {rating.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {rating.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="rounded-lg w-full h-32 object-cover"
                />
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpvote(rating.id)}
            className={hasUpvoted ? 'text-primary' : ''}
          >
            <ThumbsUp size={16} className="mr-1" fill={hasUpvoted ? 'currentColor' : 'none'} />
            {rating.upvotes}
          </Button>
        </div>
      </div>
    </Card>
  );
}

