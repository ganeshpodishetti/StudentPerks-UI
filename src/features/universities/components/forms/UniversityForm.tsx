'use client'
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { useToast } from '@/shared/components/ui/use-toast';
import { CreateUniversityRequest, University, UpdateUniversityRequest } from '@/shared/types/entities/university';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  name: string;
  code: string;
  country: string;
  state: string;
  city: string;
  isActive: boolean;
  image: File | null;
}

interface UniversityFormProps {
  university?: University | null;
  onSave: (universityData: CreateUniversityRequest | UpdateUniversityRequest) => Promise<void>;
  title: string;
  description: string;
}

export default function UniversityForm({ university, onSave, title, description }: UniversityFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(() => {
    if (university) {
      return {
        name: university.name || '',
        code: university.code || '',
        country: university.country || '',
        state: university.state || '',
        city: university.city || '',
        isActive: university.isActive ?? true,
        image: null,
      };
    }
    return {
      name: '',
      code: '',
      country: '',
      state: '',
      city: '',
      isActive: true,
      image: null,
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let universityData: CreateUniversityRequest | UpdateUniversityRequest;
      if (university) {
        universityData = {
          name: formData.name,
          code: formData.code,
          isActive: formData.isActive,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
      } else {
        universityData = {
          name: formData.name,
          code: formData.code,
          ...(formData.country && { country: formData.country }),
          ...(formData.state && { state: formData.state }),
          ...(formData.city && { city: formData.city }),
          ...(formData.image && { image: formData.image }),
        };
      }
      await onSave(universityData);
      router.push('/admin/universities');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save university. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/universities')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Universities
      </Button>

      <Card className="border-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">University Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter university name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">University Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter university code"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>

            {university && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active University</Label>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">University Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.image && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/universities')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {university ? 'Update University' : 'Create University'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
