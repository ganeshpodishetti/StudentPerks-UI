'use client'
import { CreateStoreRequest, Store } from '@/features/stores/services/storeService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  name: string;
  description: string;
  website: string;
}

interface StoreFormProps {
  store?: Store | null;
  onSave: (storeData: CreateStoreRequest) => Promise<void>;
  title: string;
  description: string;
}

export default function StoreForm({ store, onSave, title, description }: StoreFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(() => {
    if (store) {
      return {
        name: store.name || '',
        description: store.description || '',
        website: store.website || '',
      };
    }
    return {
      name: '',
      description: '',
      website: '',
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const storeData: CreateStoreRequest = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.website && { website: formData.website }),
      };
      await onSave(storeData);
      router.push('/admin/stores');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store. Please try again.",
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
        onClick={() => router.push('/admin/stores')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Stores
      </Button>

      <Card className="border-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter store name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter store description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/stores')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {store ? 'Update Store' : 'Create Store'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
