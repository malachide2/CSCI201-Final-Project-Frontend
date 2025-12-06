import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, UserPlus, UserMinus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { friendsAPI } from '../api';
import StarRating from '../components/StarRating';

interface Friend {
  userId: number;
  username: string;
  email: string;
  profileImage?: string;
}

interface FriendActivity {
  hikeId: number;
  hikeName: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}

export default function Friends() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [searchError, setSearchError] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendActivity, setFriendActivity] = useState<FriendActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await friendsAPI.getAll();
        setFriends(response.friends || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!selectedFriendId) {
      setFriendActivity([]);
      return;
    }

    const fetchActivity = async () => {
      try {
        const response = await friendsAPI.getActivity(selectedFriendId, 5);
        setFriendActivity(response.activities || []);
      } catch (error) {
        console.error('Error fetching friend activity:', error);
      }
    };

    fetchActivity();
  }, [selectedFriendId]);

  // Early returns before any logic that depends on user data
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
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your friends</h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const selectedFriend = selectedFriendId ? friends.find((f) => f.userId === selectedFriendId) : null;

  const handleSearch = async () => {
    setSearchError('');
    setSearchResult(null);

    if (!searchUsername.trim()) {
      setSearchError('Please enter a username');
      return;
    }

    try {
      // Note: You may need to implement a user search endpoint
      // For now, we'll try to add directly and let the backend handle validation
      const response = await friendsAPI.add(searchUsername);
      if (response.status === 'success') {
        // Refresh friends list
        const friendsResponse = await friendsAPI.getAll();
        setFriends(friendsResponse.friends || []);
        setSearchResult(null);
        setSearchUsername('');
      }
    } catch (error: any) {
      setSearchError(error.message || 'User not found or already in your friends list');
    }
  };

  const handleAddFriend = async (username: string) => {
    try {
      const response = await friendsAPI.add(username);
      if (response.status === 'success') {
        const friendsResponse = await friendsAPI.getAll();
        setFriends(friendsResponse.friends || []);
        setSearchResult(null);
        setSearchUsername('');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleRemoveFriend = async (friendUserId: number) => {
    try {
      await friendsAPI.remove(friendUserId);
      const friendsResponse = await friendsAPI.getAll();
      setFriends(friendsResponse.friends || []);
      if (selectedFriendId === friendUserId) {
        setSelectedFriendId(null);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Friends List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Friend Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Friend</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter username"
                    value={searchUsername}
                    onChange={(e) => {
                      setSearchUsername(e.target.value);
                      setSearchError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <Button onClick={handleSearch}>
                    <Search size={18} />
                  </Button>
                </div>

                {searchError && (
                  <p className="text-sm text-destructive">{searchError}</p>
                )}

                {searchResult && (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={searchResult.profileImage} />
                        <AvatarFallback>
                          {searchResult.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{searchResult.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {searchResult.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddFriend(searchResult.username)}
                    >
                      <UserPlus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Friends List Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                My Friends ({friends.length})
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : friends.length > 0 ? (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <button
                      key={friend.userId}
                      onClick={() => setSelectedFriendId(friend.userId)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                        selectedFriendId === friend.userId
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={friend.profileImage} />
                          <AvatarFallback>
                            {friend.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold">{friend.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {friend.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFriend(friend.userId);
                        }}
                      >
                        <UserMinus size={16} />
                      </Button>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No friends yet. Search for users to add them!
                </p>
              )}
            </Card>
          </div>

          {/* Friend Activity */}
          <div className="lg:col-span-2">
            {selectedFriend ? (
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedFriend.profileImage} />
                    <AvatarFallback className="text-2xl">
                      {selectedFriend.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedFriend.username}</h2>
                    <p className="text-muted-foreground">{selectedFriend.email}</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

                {friendActivity.length > 0 ? (
                  <div className="space-y-4">
                    {friendActivity.map((activity, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => navigate(`/hike/${activity.hikeId}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{activity.hikeName}</h4>
                          </div>
                          <Badge variant="secondary">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={activity.rating} readonly size={16} />
                          <span className="text-sm font-medium">
                            {activity.rating.toFixed(1)}
                          </span>
                        </div>

                        <p className="text-sm">{activity.comment}</p>

                        {activity.images && activity.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {activity.images.slice(0, 3).map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img}
                                alt={`Review ${imgIdx + 1}`}
                                className="rounded-lg w-full h-24 object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity from this friend
                  </p>
                )}
              </Card>
            ) : (
              <Card className="p-16 text-center">
                <p className="text-muted-foreground">
                  Select a friend to view their recent activity
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

