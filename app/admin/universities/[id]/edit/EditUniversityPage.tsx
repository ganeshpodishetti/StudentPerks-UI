'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import UniversityForm from '@/features/universities/components/forms/UniversityForm';
import { useUniversityQuery, useUpdateUniversityMutation } from '@/features/universities/hooks/useUniversitiesQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { CreateUniversityRequest, UpdateUniversityRequest } from '@/shared/types/entities/university';
import { use } from 'react';

interface EditUniversityPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUniversityPage({ params }: EditUniversityPageProps) {
  const { id } = use(params);
  const { showSuccess, showError } = useErrorHandler();
  const { data: university, isLoading, error } = useUniversityQuery(id);
  const updateUniversityMutation = useUpdateUniversityMutation();

  const handleSave = async (universityData: CreateUniversityRequest | UpdateUniversityRequest) => {
    try {
      await updateUniversityMutation.mutateAsync({ id, data: universityData as UpdateUniversityRequest });
      showSuccess('University updated successfully');
    } catch (error) {
      showError('Failed to update university');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  if (error || !university) {
    return (
      <AdminLayout>
        <AdminHeader 
          title="University Not Found"
          description="The university you're looking for doesn't exist."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Edit University"
        description={`Editing: ${university.name}`}
      />

      <UniversityForm
        university={university}
        onSave={handleSave}
        title="University Information"
        description="Update the university details."
      />
    </AdminLayout>
  );
}
