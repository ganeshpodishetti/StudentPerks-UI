'use client'
import UniversityForm from '@/features/universities/components/forms/UniversityForm';
import { useUniversityQuery, useUpdateUniversityMutation } from '@/features/universities/hooks/useUniversitiesQuery';
import { useToast } from '@/shared/components/ui/use-toast';
import { CreateUniversityRequest, UpdateUniversityRequest } from '@/shared/types/entities/university';
import { Loader2 } from 'lucide-react';
import { use } from 'react';

interface EditUniversityPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUniversityPage({ params }: EditUniversityPageProps) {
  const { id } = use(params);
  const { toast } = useToast();
  const { data: university, isLoading, error } = useUniversityQuery(id);
  const updateUniversityMutation = useUpdateUniversityMutation();

  const handleSave = async (universityData: CreateUniversityRequest | UpdateUniversityRequest) => {
    await updateUniversityMutation.mutateAsync({ id, data: universityData as UpdateUniversityRequest });
    toast({
      title: "University updated",
      description: "The university has been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load university</p>
      </div>
    );
  }

  return (
    <UniversityForm
      university={university}
      onSave={handleSave}
      title="Edit University"
      description="Update university information"
    />
  );
}
