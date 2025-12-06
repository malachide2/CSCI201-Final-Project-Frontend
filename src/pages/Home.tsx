import { useState, useEffect } from 'react';
import HikeCard from '../components/HikeCard';
import SearchBar from '../components/SearchBar';
import FilterPanel, { FilterState } from '../components/FilterPanel';
import { Button } from '../components/ui/button';
import { Filter } from 'lucide-react';
import { hikesAPI } from '../api';
import { Hike } from '../types';

const defaultFilters: FilterState = {
  difficulty: 'All',
  minLength: 0,
  maxLength: 20,
  minRating: 0
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHikes = async () => {
      setLoading(true);
      setError('');
      try {
        const difficulty = filters.difficulty === 'All' ? undefined : filters.difficulty;
        const response = await hikesAPI.getAll({
          search: searchQuery || undefined,
          difficulty,
          minLength: filters.minLength > 0 ? filters.minLength : undefined,
          maxLength: filters.maxLength < 20 ? filters.maxLength : undefined,
          minRating: filters.minRating > 0 ? filters.minRating : undefined,
        });
        
        // Transform backend response to frontend format
        if (Array.isArray(response)) {
          // Convert relative image paths to full URLs
          const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/CSCI201-Final-Project-Backend';
          const imageBaseUrl = backendBaseUrl.replace('/api', '').replace(/\/$/, ''); // Remove /api if present and trailing slash
          
          const transformedHikes = response.map((hike: any) => {
            // Map difficulty number to string
            // Backend stores: Easy=1.0, Moderate=2.5, Hard=4.0, Expert=5.0
            let difficultyStr: 'Easy' | 'Moderate' | 'Hard' | 'Expert' = 'Moderate';
            const difficultyNum = hike.difficulty || 2.0;
            // Use ranges that properly separate the exact values
            if (difficultyNum <= 1.5) difficultyStr = 'Easy';        // 1.0
            else if (difficultyNum <= 3.0) difficultyStr = 'Moderate'; // 2.5
            else if (difficultyNum <= 4.5) difficultyStr = 'Hard';    // 4.0
            else difficultyStr = 'Expert';                             // 5.0
            
            // Convert thumbnail_url to full URL if it's a relative path
            let thumbnailUrl = hike.thumbnail_url;
            if (thumbnailUrl && thumbnailUrl.startsWith('/')) {
              thumbnailUrl = imageBaseUrl + thumbnailUrl;
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
              totalRatings: hike.totalRatings || 0,
              createdBy: String(hike.created_by || hike.createdBy || ''),
              createdAt: hike.created_at || hike.createdAt || new Date().toISOString()
            };
          });
          setHikes(transformedHikes);
        } else {
          setHikes([]);
        }
      } catch (err) {
        console.error('Error fetching hikes:', err);
        setError('Failed to load hikes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHikes();
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-center mb-8 text-green-50">
            Explore thousands of hiking trails with reviews from fellow adventurers
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by trail name or location..."
            />
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto bg-white"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-80 shrink-0">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
              />
            </aside>
          )}

          {/* Hikes Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Loading...' : `${hikes.length} ${hikes.length === 1 ? 'Trail' : 'Trails'} Found`}
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading trails...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : hikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hikes.map((hike) => (
                  <HikeCard key={hike.id} hike={hike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No trails found matching your criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters(defaultFilters);
                  }}
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

