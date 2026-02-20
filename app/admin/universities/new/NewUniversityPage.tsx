'use client'
import UniversityForm from '@/features/universities/components/forms/UniversityForm';
import { useCreateUniversityMutation } from '@/features/universities/hooks/useUniversitiesQuery';
import { useToast } from '@/shared/components/ui/use-toast';
import { CreateUniversityRequest } from '@/shared/types/entities/university';

export default function NewUniversityPage() {
  const { toast } = useToast();
  const createUniversityMutation = useCreateUniversityMutation();

  const handleSave = async (universityData: CreateUniversityRequest) => {
    await createUniversityMutation.mutateAsync(universityData);
    toast({
      title: "University created",
      description: "The university has been created successfully.",
    });
  };

  return (
    <UniversityForm
      onSave={handleSave}
      title="Create New University"
      description="Add a new university to the system"
    />
  );
}
