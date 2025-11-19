import { useState, useMemo } from 'react';
import HikeCard from '../components/HikeCard';
import SearchBar from '../components/SearchBar';
import FilterPanel, { FilterState } from '../components/FilterPanel';
import { Button } from '../components/ui/button';
import { Filter } from 'lucide-react';
import { hikes } from '../data/dummy-data';

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

  const filteredHikes = useMemo(() => {
    return hikes.filter((hike) => {
      // Search filter
      const matchesSearch =
        hike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hike.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty filter
      const matchesDifficulty =
        filters.difficulty === 'All' || hike.difficulty === filters.difficulty;

      // Length filter
      const matchesLength =
        hike.length >= filters.minLength && hike.length <= filters.maxLength;

      // Rating filter
      const matchesRating = hike.averageRating >= filters.minRating;

      return matchesSearch && matchesDifficulty && matchesLength && matchesRating;
    });
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
                {filteredHikes.length} {filteredHikes.length === 1 ? 'Trail' : 'Trails'} Found
              </h2>
            </div>

            {filteredHikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHikes.map((hike) => (
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

