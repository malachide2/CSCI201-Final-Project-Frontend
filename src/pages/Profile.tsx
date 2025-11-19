import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hikes, ratings } from '../data/dummy-data';
import HikeCard from '../components/HikeCard';
import CommentCard from '../components/CommentCard';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('hikes');

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

  // Now it's safe to use user data
  const userHikes = hikes.filter((h) => h.createdBy === user.id);
  const userRatings = ratings
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    hikesAdded: userHikes.length,
    reviewsPosted: userRatings.length,
    totalUpvotes: userRatings.reduce((sum, r) => sum + r.upvotes, 0),
    friends: user.friends.length
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
            {userHikes.length > 0 ? (
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
            {userRatings.length > 0 ? (
              <div className="space-y-4 max-w-4xl">
                {userRatings.map((rating) => {
                  const hike = hikes.find((h) => h.id === rating.hikeId);
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

