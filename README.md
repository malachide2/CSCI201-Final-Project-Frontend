# Hiking Trail Discovery Platform

A modern, full-featured frontend application for discovering, sharing, and reviewing hiking trails. Built with React, TypeScript, and modern UI practices.

## 🏔️ Features

### Authentication System
- User login and signup with form validation
- Password recovery with email verification flow
- Persistent sessions using localStorage
- Protected routes for authenticated users

### Trail Discovery
- **Home Page**: Beautiful grid layout displaying all hiking trails
- **Search Functionality**: Real-time search by trail name or location
- **Advanced Filters**: Filter by difficulty, length, and rating
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Trail Details
- Comprehensive trail information with image galleries
- Average ratings with star visualization
- User reviews and comments sorted by upvotes
- Interactive upvote system for reviews
- Add reviews with star ratings (authenticated users only)

### Trail Management
- **Add New Trails**: Form to submit new hiking trails with:
  - Name, location, difficulty, and length
  - Multiple image uploads
  - Duplicate name checking (case-insensitive)
- **User Profiles**: View your own trails and reviews

### Social Features
- **Friends System**: One-way friendship model
  - Add friends by username
  - Remove friends from your list
  - View friends' recent activity
- **Activity Feed**: See your friends' latest reviews and photos

## 🛠️ Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling with custom hiking theme
- **shadcn/ui** - High-quality, accessible component library
- **Lucide Icons** - Beautiful, consistent icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn components
│   ├── CommentCard.tsx
│   ├── FilterPanel.tsx
│   ├── HikeCard.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── StarRating.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── data/              # Mock data
│   └── dummy-data.ts  # Sample hikes, users, and ratings
├── pages/             # Page components
│   ├── AddHike.tsx
│   ├── Friends.tsx
│   ├── HikeDetail.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Profile.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app with routing
└── main.tsx           # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CSCI201-Final-Project-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Demo Credentials

For testing, you can use these demo credentials:
- **Email**: trail@example.com
- **Password**: password

## 🎨 Design System

### Color Palette
The app uses a nature-inspired, hiking-themed color scheme:
- **Primary**: Forest Green (`oklch(0.55 0.15 155)`)
- **Accent**: Emerald (`oklch(0.65 0.18 140)`)
- **Background**: Soft Green-tinted White
- **Muted**: Light Green-gray tones

### Components
Built with shadcn/ui for consistency:
- Cards, Buttons, Inputs, Dropdowns
- Dialogs, Badges, Avatars
- Tabs, Sliders, Textareas

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with trail grid and filters |
| `/hike/:id` | Detailed trail view with reviews |
| `/login` | Login/Signup page |
| `/add-hike` | Add new trail (authenticated) |
| `/profile` | User profile with trails and reviews |
| `/friends` | Friends list and activity feed |

## 🔄 Backend Integration

The frontend is designed to be **backend-agnostic** and ready for integration:

### Current Mock Implementation
- Uses `dummy-data.ts` for sample data
- `AuthContext` manages authentication state
- All CRUD operations are simulated

### Ready for Backend
To connect to a real backend:

1. **Replace data fetching**: Swap dummy data imports with API calls
2. **Update AuthContext**: Replace mock login/signup with actual API endpoints
3. **Add API service layer**: Create `src/services/api.ts` for backend communication
4. **Environment variables**: Use `.env` for API URLs

Example API service structure:
```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const hikeService = {
  getAll: () => fetch(`${API_URL}/hikes`).then(r => r.json()),
  getById: (id) => fetch(`${API_URL}/hikes/${id}`).then(r => r.json()),
  create: (data) => fetch(`${API_URL}/hikes`, { method: 'POST', body: JSON.stringify(data) })
};
```

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- Modern React practices with hooks
- Functional components only
- TypeScript for type safety
- Clean, modular component architecture
- Consistent naming conventions

## 🌟 Key Features Implementation

### Star Rating Component
Interactive half-star rating system (0.5 increments) with hover effects and readonly mode.

### Search & Filter
Real-time search with debouncing and advanced filtering by multiple criteria.

### Image Galleries
Carousel-style image viewer with thumbnail navigation.

### Upvote System
Like/unlike comments with visual feedback and count tracking.

### Responsive Navigation
Mobile-friendly navbar with dropdown menu for user actions.
