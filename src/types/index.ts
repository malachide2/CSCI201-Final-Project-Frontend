export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  friends: string[]; // user IDs
}

export interface Hike {
  id: string;
  name: string;
  location: string;
  difficulty: Difficulty;
  length: number; // in miles
  description: string;
  images: string[];
  averageRating: number;
  totalRatings: number;
  createdBy: string; // user ID
  createdAt: string;
}

export interface Rating {
  id: string;
  hikeId: string;
  userId: string;
  rating: number; // 1-5 in 0.5 increments
  comment: string;
  upvotes: number;
  upvotedBy: string[]; // user IDs
  images: string[];
  createdAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  createdAt: string;
}

