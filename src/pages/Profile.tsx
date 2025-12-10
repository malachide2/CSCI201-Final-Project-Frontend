import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hikesAPI, reviewsAPI, friendsAPI } from '../api';
import { Hike, Rating } from '../types';
import HikeCard from '../components/HikeCard';
import CommentCard from '../components/CommentCard';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('hikes');
  const [userHikes, setUserHikes] = useState<Hike[]>([]);
  const [allHikes, setAllHikes] = useState<Hike[]>([]); // Store all hikes to find hikes for reviews
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all hikes
        const allHikesResponse = await hikesAPI.getAll();
        
        // Debug: Log raw response
        console.log('Raw API response (first 3 hikes):', 
          Array.isArray(allHikesResponse) 
            ? allHikesResponse.slice(0, 3).map((h: any) => ({
                hike_id: h.hike_id,
                name: h.name,
                created_by: h.created_by,
                createdBy: h.createdBy,
                hasCreatedBy: 'created_by' in h || 'createdBy' in h
              }))
            : 'Not an array'
        );
        
        // Transform backend response to frontend format (same as Home.tsx)
        const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/CSCI201-Final-Project-Backend';
        const imageBaseUrl = backendBaseUrl.replace('/api', '').replace(/\/$/, '');
        
        const transformedHikes = Array.isArray(allHikesResponse) ? allHikesResponse.map((hike: any) => {
          // Map difficulty number to string
          let difficultyStr: 'Easy' | 'Moderate' | 'Hard' | 'Expert' = 'Moderate';
          const difficultyNum = hike.difficulty || 2.0;
          if (difficultyNum <= 1.5) difficultyStr = 'Easy';
          else if (difficultyNum <= 3.0) difficultyStr = 'Moderate';
          else if (difficultyNum <= 4.5) difficultyStr = 'Hard';
          else difficultyStr = 'Expert';
          
          // Convert thumbnail_url to full URL if it's a relative path
          let thumbnailUrl = hike.thumbnail_url;
          if (thumbnailUrl && thumbnailUrl.startsWith('/')) {
            thumbnailUrl = imageBaseUrl + thumbnailUrl;
          }
          
          // Handle created_by field - check both snake_case and camelCase
          // Use != null to check for both null and undefined, but allow 0 as a valid value
          let createdByValue = '';
          if (hike.created_by != null) {
            createdByValue = String(hike.created_by);
          } else if (hike.createdBy != null) {
            createdByValue = String(hike.createdBy);
          }
          
          return {
            id: String(hike.hike_id || hike.id || ''),
            name: hike.name || '',
            location: hike.location_text || hike.location || '',
            difficulty: difficultyStr,
            length: hike.distance || hike.length || 0,
            description: hike.description || '',
            images: thumbnailUrl ? [thumbnailUrl] : (hike.images || []),
            averageRating: hike.average_rating || hike.averageRating || 0,
            totalRatings: hike.total_ratings || hike.totalRatings || 0,
            createdBy: createdByValue,
            createdAt: hike.created_at || hike.createdAt || new Date().toISOString()
          };
        }) : [];

        // Store all hikes for finding hikes in reviews
        setAllHikes(transformedHikes);
        
        // Filter hikes created by the user
        // Ensure both sides are strings for comparison
        const userIdStr = String(user.id).trim();
        const userCreatedHikes = transformedHikes.filter((h: Hike) => {
          const hikeCreatedByStr = String(h.createdBy || '').trim();
          const matches = hikeCreatedByStr === userIdStr && hikeCreatedByStr !== '';
          if (matches) {
            console.log('Match found:', { hikeId: h.id, hikeName: h.name, createdBy: hikeCreatedByStr, userId: userIdStr });
          }
          return matches;
        });
        
        console.log('Profile Debug Info:');
        console.log('  User ID:', userIdStr, '(type:', typeof userIdStr, ')');
        console.log('  Total hikes fetched:', transformedHikes.length);
        console.log('  User created hikes found:', userCreatedHikes.length);
        console.log('  Sample hikes:', transformedHikes.slice(0, 5).map(h => ({ 
          id: h.id, 
          name: h.name, 
          createdBy: h.createdBy, 
          createdByType: typeof h.createdBy,
          matches: String(h.createdBy || '').trim() === userIdStr
        })));
        
        setUserHikes(userCreatedHikes);

        // Fetch reviews for all hikes and filter by userId
        // We need to fetch reviews for all hikes to find reviews the user made
        const allHikeIds = transformedHikes.map((h: Hike) => Number(h.id));
        const reviewPromises = allHikeIds.map((hikeId: number) => 
          reviewsAPI.getByHikeId(hikeId).catch(() => ({ reviews: [] }))
        );
        
        const reviewResponses = await Promise.all(reviewPromises);
        const allReviews: Rating[] = [];
        
        reviewResponses.forEach((response: any) => {
          const reviews = response.reviews || [];
          reviews.forEach((review: any) => {
            // Transform review to match Rating type
            const reviewUserId = String(review.userId || review.user_id || '');
            if (reviewUserId === user.id) {
              let upvotedBy: string[] = [];
              if (Array.isArray(review.upvotedBy)) {
                upvotedBy = review.upvotedBy.map((id: any) => String(id));
              } else if (review.upvotedByCurrentUser && user) {
                upvotedBy = [user.id];
              }
              
              allReviews.push({
                id: String(review.id || review.review_id || ''),
                hikeId: String(review.hikeId || review.hike_id || ''),
                userId: reviewUserId,
                rating: review.rating || 0,
                comment: review.comment || review.review_body || '',
                upvotes: review.upvotes || review.upvotes_count || 0,
                upvotedBy: upvotedBy,
                images: review.images || [],
                createdAt: review.createdAt || review.created_at || new Date().toISOString(),
                username: review.username || `User ${reviewUserId}`
              } as Rating);
            }
          });
        });
        
        setUserRatings(allReviews);

        // Fetch friends count
        try {
          const friendsResponse = await friendsAPI.getAll();
          setFriendsCount(friendsResponse.totalFriends || 0);
        } catch (error) {
          console.error('Error fetching friends:', error);
          setFriendsCount(0);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Early returns before any hooks that depend on user data
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const stats = {
    hikesAdded: userHikes.length,
    reviewsPosted: userRatings.length,
    totalUpvotes: userRatings.reduce((sum, r) => sum + r.upvotes, 0),
    friends: friendsCount
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.profileImage} alt={user.username} />
              <AvatarFallback className="text-4xl">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <p className="text-muted-foreground mb-6">{user.email}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.hikesAdded}</div>
                  <div className="text-sm text-muted-foreground">Hikes Added</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.reviewsPosted}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.totalUpvotes}</div>
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.friends}</div>
                  <div className="text-sm text-muted-foreground">Friends</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="hikes">My Hikes</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="hikes">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading hikes...</p>
              </div>
            ) : userHikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userHikes.map((hike) => (
                  <HikeCard key={hike.id} hike={hike} />
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <MapPin size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hikes added yet</h3>
                <p className="text-muted-foreground mb-6">
                  Share your favorite trails with the community
                </p>
                <Button onClick={() => navigate('/add-hike')}>Add Your First Hike</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading reviews...</p>
              </div>
            ) : userRatings.length > 0 ? (
              <div className="space-y-4 max-w-4xl">
                {userRatings.map((rating) => {
                  // Find hike from all hikes, not just user-created hikes
                  const hike = allHikes.find((h) => h.id === rating.hikeId);
                  return (
                    <div key={rating.id}>
                      {hike && (
                        <div className="mb-2">
                          <button
                            onClick={() => navigate(`/hike/${hike.id}`)}
                            className="text-lg font-semibold hover:text-primary transition-colors"
                          >
                            {hike.name}
                          </button>
                          <p className="text-sm text-muted-foreground">{hike.location}</p>
                        </div>
                      )}
                      <CommentCard rating={rating} onUpvote={() => {}} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <Star size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start reviewing trails to help other hikers
                </p>
                <Button onClick={() => navigate('/')}>Explore Trails</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

