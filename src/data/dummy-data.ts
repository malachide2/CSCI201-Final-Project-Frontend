import { User, Hike, Rating } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'trailblazer',
    email: 'trail@example.com',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    friends: ['2', '3']
  },
  {
    id: '2',
    username: 'mountaineer',
    email: 'mountain@example.com',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    friends: ['1']
  },
  {
    id: '3',
    username: 'adventurer',
    email: 'adventure@example.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    friends: ['1', '2']
  },
  {
    id: '4',
    username: 'hiker_pro',
    email: 'hiker@example.com',
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    friends: []
  }
];

export const hikes: Hike[] = [
  {
    id: '1',
    name: 'Angels Landing',
    location: 'Zion National Park, Utah',
    difficulty: 'Hard',
    length: 5.4,
    description: 'A thrilling hike with stunning views and exposed sections. Not for the faint of heart! Features chain sections and steep drop-offs.',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    ],
    averageRating: 4.8,
    totalRatings: 156,
    createdBy: '1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Half Dome',
    location: 'Yosemite National Park, California',
    difficulty: 'Expert',
    length: 16.0,
    description: 'An iconic and challenging full-day hike to one of Yosemite\'s most famous landmarks. Requires permits and cable climbing.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
    ],
    averageRating: 4.9,
    totalRatings: 234,
    createdBy: '2',
    createdAt: '2024-01-10T09:30:00Z'
  },
  {
    id: '3',
    name: 'Avalanche Lake Trail',
    location: 'Glacier National Park, Montana',
    difficulty: 'Moderate',
    length: 4.5,
    description: 'A beautiful hike through old-growth forest leading to a pristine alpine lake with waterfall views.',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1472791108553-c9405341e398?w=800',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800'
    ],
    averageRating: 4.6,
    totalRatings: 89,
    createdBy: '3',
    createdAt: '2024-02-01T14:20:00Z'
  },
  {
    id: '4',
    name: 'Emerald Pools',
    location: 'Zion National Park, Utah',
    difficulty: 'Easy',
    length: 3.0,
    description: 'A family-friendly trail featuring waterfalls, pools, and hanging gardens. Perfect for beginners.',
    images: [
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
      'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800'
    ],
    averageRating: 4.4,
    totalRatings: 67,
    createdBy: '1',
    createdAt: '2024-02-05T11:15:00Z'
  },
  {
    id: '5',
    name: 'The Narrows',
    location: 'Zion National Park, Utah',
    difficulty: 'Moderate',
    length: 9.4,
    description: 'Wade through the Virgin River in a stunning slot canyon. Requires special preparation and equipment.',
    images: [
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    averageRating: 4.7,
    totalRatings: 178,
    createdBy: '2',
    createdAt: '2024-01-20T08:45:00Z'
  },
  {
    id: '6',
    name: 'Cascade Canyon Trail',
    location: 'Grand Teton National Park, Wyoming',
    difficulty: 'Moderate',
    length: 9.1,
    description: 'Spectacular views of the Teton Range with opportunities to see wildlife. Gradual elevation gain.',
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800'
    ],
    averageRating: 4.5,
    totalRatings: 92,
    createdBy: '3',
    createdAt: '2024-02-10T13:00:00Z'
  },
  {
    id: '7',
    name: 'Delicate Arch',
    location: 'Arches National Park, Utah',
    difficulty: 'Moderate',
    length: 3.0,
    description: 'Utah\'s most famous arch! A moderately strenuous hike across slickrock with incredible views.',
    images: [
      'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800'
    ],
    averageRating: 4.9,
    totalRatings: 201,
    createdBy: '4',
    createdAt: '2024-01-25T10:30:00Z'
  },
  {
    id: '8',
    name: 'Bright Angel Trail',
    location: 'Grand Canyon National Park, Arizona',
    difficulty: 'Hard',
    length: 12.0,
    description: 'A challenging descent into the Grand Canyon. Remember: what goes down must come back up!',
    images: [
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800',
      'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800'
    ],
    averageRating: 4.7,
    totalRatings: 145,
    createdBy: '1',
    createdAt: '2024-02-15T09:00:00Z'
  }
];

export const ratings: Rating[] = [
  {
    id: '1',
    hikeId: '1',
    userId: '2',
    rating: 5.0,
    comment: 'Absolutely breathtaking! The chains section is intense but worth it. Go early to avoid crowds.',
    upvotes: 24,
    upvotedBy: ['1', '3', '4'],
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'],
    createdAt: '2024-01-16T15:30:00Z'
  },
  {
    id: '2',
    hikeId: '1',
    userId: '3',
    rating: 4.5,
    comment: 'Amazing views but very crowded. Not recommended if you have a fear of heights.',
    upvotes: 18,
    upvotedBy: ['1', '2'],
    images: [],
    createdAt: '2024-01-18T11:20:00Z'
  },
  {
    id: '3',
    hikeId: '2',
    userId: '1',
    rating: 5.0,
    comment: 'The most rewarding hike I\'ve ever done! The cables are scary but manageable. Start before dawn!',
    upvotes: 45,
    upvotedBy: ['2', '3', '4'],
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    createdAt: '2024-01-12T16:00:00Z'
  },
  {
    id: '4',
    hikeId: '2',
    userId: '4',
    rating: 4.5,
    comment: 'Challenging but incredible. Make sure you have your permit well in advance!',
    upvotes: 32,
    upvotedBy: ['1', '2', '3'],
    images: [],
    createdAt: '2024-01-14T14:15:00Z'
  },
  {
    id: '5',
    hikeId: '3',
    userId: '2',
    rating: 4.5,
    comment: 'Perfect trail for families. The lake is stunning and the waterfalls are gorgeous.',
    upvotes: 15,
    upvotedBy: ['1', '3'],
    images: [],
    createdAt: '2024-02-03T10:45:00Z'
  },
  {
    id: '6',
    hikeId: '4',
    userId: '3',
    rating: 4.0,
    comment: 'Great beginner hike with beautiful scenery. Can get crowded during peak season.',
    upvotes: 8,
    upvotedBy: ['1'],
    images: [],
    createdAt: '2024-02-07T13:30:00Z'
  },
  {
    id: '7',
    hikeId: '5',
    userId: '1',
    rating: 5.0,
    comment: 'One of the most unique hikes! Walking through the river is an adventure. Rent good water shoes!',
    upvotes: 28,
    upvotedBy: ['2', '3', '4'],
    images: ['https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800'],
    createdAt: '2024-01-22T12:00:00Z'
  },
  {
    id: '8',
    hikeId: '7',
    userId: '2',
    rating: 5.0,
    comment: 'Iconic Utah! The arch is even more impressive in person. Sunset is magical here.',
    upvotes: 38,
    upvotedBy: ['1', '3', '4'],
    images: [],
    createdAt: '2024-01-27T17:20:00Z'
  }
];

