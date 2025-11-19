import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Difficulty } from '../types';

export interface FilterState {
  difficulty: Difficulty | 'All';
  minLength: number;
  maxLength: number;
  minRating: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onReset }: FilterPanelProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Difficulty Filter */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value) =>
              onFilterChange({ ...filters, difficulty: value as Difficulty | 'All' })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Length Filter */}
        <div className="space-y-2">
          <Label>Length (miles)</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={20}
              step={0.5}
              value={[filters.minLength, filters.maxLength]}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  minLength: value[0],
                  maxLength: value[1]
                })
              }
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{filters.minLength} mi</span>
              <span>{filters.maxLength} mi</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.minRating]}
              onValueChange={(value) =>
                onFilterChange({ ...filters, minRating: value[0] })
              }
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{filters.minRating.toFixed(1)} stars</span>
              <span>5.0 stars</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

