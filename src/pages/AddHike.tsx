import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Difficulty } from '../types';
import { hikesAPI } from '../api';

export default function AddHike() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Moderate');
  const [length, setLength] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to add a hike</h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImagePreviews((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!name.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const lengthNum = parseFloat(length);
    if (isNaN(lengthNum) || lengthNum <= 0) {
      setError('Please enter a valid length');
      return;
    }

    if (imageFiles.length === 0) {
      setError('Please add at least one image');
      return;
    }

    // Convert difficulty to number (1-5)
    const difficultyMap: Record<Difficulty, number> = {
      'Easy': 1,
      'Moderate': 2.5,
      'Hard': 4,
      'Expert': 5
    };

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('location', location.trim());
      formData.append('difficulty', difficultyMap[difficulty].toString());
      formData.append('distance', lengthNum.toString());
      formData.append('description', description.trim());
      
      // Add image files (backend expects files named "images" or "image")
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      await hikesAPI.create(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add hike. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-2 text-green-600">Hike Added Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your hike has been added and is now visible to the community.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

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
        <Card className="max-w-3xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-2">Add New Hike</h1>
          <p className="text-muted-foreground mb-8">
            Share your favorite trail with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Trail Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Angels Landing"
                required
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Zion National Park, Utah"
                required
                className="mt-2"
              />
            </div>

            {/* Difficulty and Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="length">Length (miles) *</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  min="0"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g., 5.4"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the trail, its features, and what makes it special..."
                rows={5}
                required
                className="mt-2"
              />
            </div>

            {/* Images */}
            <div>
              <Label>Trail Images *</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Upload images for the trail (at least one required, max 5MB per image)
              </p>
              
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload size={18} className="mr-2" />
                  Select Images
                </Button>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {imageFiles[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Add Hike
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

