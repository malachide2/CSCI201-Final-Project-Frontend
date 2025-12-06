const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/CSCI201-Final-Project-Backend';

interface LoginResponse {
  status: 'success' | 'fail' | 'error';
  user_id?: number;
  message?: string;
}

interface SignupResponse {
  status: 'success' | 'fail' | 'error';
  user_id?: number;
  message?: string;
}

interface GetAllHikesParams {
  search?: string;
  difficulty?: string;
  minLength?: number;
  maxLength?: number;
  minRating?: number;
}

interface ReviewListResponse {
  hikeId: number;
  averageRating: number;
  totalReviews: number;
  reviews: any[];
}

interface CreateReviewResponse {
  id: number;
  hikeId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  upvotes: number;
  createdAt: string;
  upvotedByCurrentUser: boolean;
}

interface UpvoteResponse {
  reviewId: number;
  upvotes: number;
  upvoted: boolean;
}

interface FriendsResponse {
  userId: number;
  totalFriends: number;
  totalFollowers: number;
  friends: Array<{
    userId: number;
    username: string;
    email: string;
    friendsSince?: string;
  }>;
}

interface FriendActivityResponse {
  friendUserId: number;
  friendUsername: string;
  totalActivities: number;
  activities: Array<{
    type: string;
    id: number;
    hikeId: number;
    hikeName: string;
    rating: number;
    comment: string;
    createdAt: string;
    username: string;
  }>;
}

export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status: 'error', message: 'Login failed' }));
      return errorData;
    }

    return await response.json();
  },

  async signup(username: string, email: string, password: string): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status: 'error', message: 'Signup failed' }));
      return errorData;
    }

    return await response.json();
  },
};

export const hikesAPI = {
  async getAll(params: GetAllHikesParams = {}): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('q', params.search);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.minLength !== undefined) queryParams.append('min_length', params.minLength.toString());
    if (params.maxLength !== undefined) queryParams.append('max_length', params.maxLength.toString());
    if (params.minRating !== undefined) queryParams.append('min_rating', params.minRating.toString());

    const url = `${API_BASE_URL}/api/hikes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hikes');
    }

    return await response.json();
  },

  async getById(id: string | number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/hikes/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch hike');
    }

    return await response.json();
  },

  async create(formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/hikes/add`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create hike' }));
      throw new Error(errorData.error || errorData.message || 'Failed to create hike');
    }

    return await response.json();
  },
};

export const reviewsAPI = {
  async getByHikeId(hikeId: number): Promise<ReviewListResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reviews?hikeId=${hikeId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  },

  async create(hikeId: number, rating: number, comment: string): Promise<CreateReviewResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ hikeId, rating, comment }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create review' }));
      throw new Error(errorData.error || errorData.message || 'Failed to create review');
    }

    return await response.json();
  },

  async upvote(reviewId: number): Promise<UpvoteResponse> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ reviewId }),
    });

    if (!response.ok) {
      throw new Error('Failed to upvote review');
    }

    return await response.json();
  },
};

export const friendsAPI = {
  async getAll(): Promise<FriendsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/friends`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friends');
    }

    return await response.json();
  },

  async add(username: string): Promise<{ status: string; message?: string; friend?: any }> {
    const response = await fetch(`${API_BASE_URL}/api/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to add friend' }));
      throw new Error(errorData.error || errorData.message || 'Failed to add friend');
    }

    return await response.json();
  },

  async remove(friendUserId: number): Promise<{ status: string; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/friends?friendUserId=${friendUserId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to remove friend');
    }

    return await response.json();
  },

  async getActivity(friendId: number, limit: number = 20): Promise<FriendActivityResponse> {
    const response = await fetch(`${API_BASE_URL}/api/friends/activity?friendUserId=${friendId}&limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friend activity');
    }

    return await response.json();
  },
};
