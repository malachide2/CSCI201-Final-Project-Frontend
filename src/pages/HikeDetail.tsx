import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import StarRating from '../components/StarRating';
import CommentCard from '../components/CommentCard';
import { MapPin, TrendingUp, ArrowLeft, Upload } from 'lucide-react';
import { hikes, ratings as initialRatings, users } from '../data/dummy-data';
import { useAuth } from '../contexts/AuthContext';
import { Rating } from '../types';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Hard: 'bg-orange-100 text-orange-800 border-orange-300',
  Expert: 'bg-red-100 text-red-800 border-red-300'
};

export default function HikeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const hike = hikes.find((h) => h.id === id);
  const hikeRatings = useMemo(
    () => ratings.filter((r) => r.hikeId === id).sort((a, b) => b.upvotes - a.upvotes),
    [ratings, id]
  );

  if (!hike) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Hike not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!isAuthenticated || !user || newRating === 0) return;

    const newReview: Rating = {
      id: String(ratings.length + 1),
      hikeId: hike.id,
      userId: user.id,
      rating: newRating,
      comment: newComment,
      upvotes: 0,
      upvotedBy: [],
      images: [],
      createdAt: new Date().toISOString()
    };

    setRatings([...ratings, newReview]);
    setNewRating(0);
    setNewComment('');
  };

  const handleUpvote = (ratingId: string) => {
    if (!isAuthenticated || !user) return;

    setRatings(
      ratings.map((r) => {
        if (r.id === ratingId) {
          const hasUpvoted = r.upvotedBy.includes(user.id);
          return {
            ...r,
            upvotes: hasUpvoted ? r.upvotes - 1 : r.upvotes + 1,
            upvotedBy: hasUpvoted
              ? r.upvotedBy.filter((id) => id !== user.id)
              : [...r.upvotedBy, user.id]
          };
        }
        return r;
      })
    );
  };

  const creator = users.find((u) => u.id === hike.createdBy);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img
                  src={hike.images[selectedImage]}
                  alt={hike.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {hike.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {hike.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Hike Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{hike.name}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={18} className="mr-1" />
                    <span>{hike.location}</span>
                  </div>
                </div>
                <Badge className={difficultyColors[hike.difficulty]}>
                  {hike.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="flex items-center">
                  <StarRating rating={hike.averageRating} readonly size={24} />
                  <span className="ml-2 text-lg font-semibold">
                    {hike.averageRating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    ({hike.totalRatings} reviews)
                  </span>
                </div>
                <div className="flex items-center text-lg">
                  <TrendingUp size={20} className="mr-2 text-muted-foreground" />
                  <span className="font-semibold">{hike.length} miles</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">About This Trail</h2>
                <p className="text-muted-foreground leading-relaxed">{hike.description}</p>
              </div>

              {creator && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Added by <span className="font-semibold text-foreground">{creator.username}</span> on{' '}
                    {new Date(hike.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </Card>

            {/* Reviews Section */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews ({hikeRatings.length})</h2>

              {/* Add Review Form */}
              {isAuthenticated ? (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-4">Share Your Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Your Rating</Label>
                      <div className="mt-2">
                        <StarRating
                          rating={newRating}
                          onRatingChange={setNewRating}
                          size={32}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share details about your experience on this trail..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={newRating === 0 || !newComment.trim()}
                    >
                      Post Review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground mb-4">
                    Sign in to leave a review
                  </p>
                  <Button onClick={() => navigate('/login')}>Sign In</Button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {hikeRatings.length > 0 ? (
                  hikeRatings.map((rating) => (
                    <CommentCard
                      key={rating.id}
                      rating={rating}
                      onUpvote={handleUpvote}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews yet. Be the first to review this trail!
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Trail Actions</h3>
              {isAuthenticated && (
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Upload size={18} className="mr-2" />
                    Upload Photos
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

