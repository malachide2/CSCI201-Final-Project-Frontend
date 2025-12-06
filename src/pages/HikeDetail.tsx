import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import StarRating from '../components/StarRating';
import CommentCard from '../components/CommentCard';
import { MapPin, TrendingUp, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Rating, Hike } from '../types';
import { hikesAPI, reviewsAPI } from '../api';

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
  
  const [hike, setHike] = useState<Hike | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [hikeData, reviewsData] = await Promise.all([
          hikesAPI.getById(id),
          reviewsAPI.getByHikeId(Number(id))
        ]);
        
        // Transform backend response to frontend format
        if (hikeData) {
          // Convert relative image paths to full URLs
          const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/CSCI201-Final-Project-Backend';
          const imageBaseUrl = backendBaseUrl.replace('/api', '').replace(/\/$/, ''); // Remove /api if present and trailing slash
          
          const transformedImages = (hikeData.images || []).map((img: string) => {
            // If image path is relative (starts with /), prepend backend URL
            if (img && img.startsWith('/')) {
              return imageBaseUrl + img;
            }
            // If already a full URL, use as is
            return img;
          });
          
          const transformedHike = {
            id: String(hikeData.hike_id || hikeData.id || ''),
            name: hikeData.name || '',
            location: hikeData.location_text || hikeData.location || '',
            difficulty: hikeData.difficulty || 'Moderate',
            length: hikeData.distance || hikeData.length || 0,
            description: hikeData.description || '',
            images: transformedImages,
            averageRating: hikeData.average_rating || hikeData.averageRating || 0,
            totalRatings: hikeData.total_ratings || hikeData.totalRatings || 0,
            createdBy: String(hikeData.created_by || hikeData.createdBy || ''),
            createdAt: hikeData.created_at || hikeData.createdAt || new Date().toISOString()
          };
          setHike(transformedHike);
        }
        
        // Transform reviews response if needed
        const reviews = reviewsData.reviews || reviewsData || [];
        const transformedReviews = Array.isArray(reviews) ? reviews.map((review: any) => {
          // Ensure upvotedBy is always an array
          let upvotedBy: string[] = [];
          if (Array.isArray(review.upvotedBy)) {
            upvotedBy = review.upvotedBy.map((id: any) => String(id));
          } else if (review.upvotedByCurrentUser && user) {
            // If the current user has upvoted, add their ID to the array
            upvotedBy = [user.id];
          }
          
          return {
            id: String(review.id || review.review_id || ''),
            hikeId: String(review.hikeId || review.hike_id || ''),
            userId: String(review.userId || review.user_id || ''),
            rating: review.rating || 0,
            comment: review.comment || review.review_body || '',
            upvotes: review.upvotes || review.upvotes_count || 0,
            upvotedBy: upvotedBy,
            images: review.images || [],
            createdAt: review.createdAt || review.created_at || new Date().toISOString(),
            username: review.username || `User ${review.userId || review.user_id}`
          };
        }) : [];
        setRatings(transformedReviews);
      } catch (error) {
        console.error('Error fetching hike data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading hike details...</p>
      </div>
    );
  }

  if (!hike) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Hike not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const hikeRatings = [...ratings].sort((a, b) => b.upvotes - a.upvotes);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user || newRating === 0 || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await reviewsAPI.create(Number(hike.id), newRating, newComment);
      setRatings([...ratings, response]);
      setNewRating(0);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (ratingId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await reviewsAPI.upvote(Number(ratingId));
      setRatings(ratings.map(r => {
        if (r.id === ratingId) {
          // Ensure upvotedBy is always an array
          const currentUpvotedBy = Array.isArray(r.upvotedBy) ? r.upvotedBy : [];
          
          // Update based on response
          let newUpvotedBy: string[];
          if (response.upvoted) {
            // Add user ID if not already present
            newUpvotedBy = currentUpvotedBy.includes(user.id) 
              ? currentUpvotedBy 
              : [...currentUpvotedBy, user.id];
          } else {
            // Remove user ID
            newUpvotedBy = currentUpvotedBy.filter(id => id !== user.id);
          }
          
          return { 
            ...r, 
            upvotes: response.upvotes, 
            upvotedBy: newUpvotedBy 
          };
        }
        return r;
      }));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {hike.images && hike.images.length > 0 ? (
                  <img
                    src={hike.images[selectedImage]}
                    alt={hike.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No images available
                  </div>
                )}
              </div>
              {hike.images && hike.images.length > 1 && (
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

              {hike.description && hike.description.trim() && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">About This Trail</h2>
                  <p className="text-muted-foreground leading-relaxed">{hike.description}</p>
                </div>
              )}

              {hike.createdAt && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Added on{' '}
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
                      disabled={newRating === 0 || !newComment.trim() || submitting}
                    >
                      {submitting ? 'Posting...' : 'Post Review'}
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
        </div>
      </div>
    </div>
  );
}

