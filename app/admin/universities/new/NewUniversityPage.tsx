'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import UniversityForm from '@/features/universities/components/forms/UniversityForm';
import { useCreateUniversityMutation } from '@/features/universities/hooks/useUniversitiesQuery';
import { useErrorHandler } from '@/shared/contexts/ErrorContext';
import { CreateUniversityRequest } from '@/shared/types/entities/university';

export default function NewUniversityPage() {
  const { isLoading: authLoading } = useAuth();
  const { showSuccess, showError } = useErrorHandler();
  const createUniversityMutation = useCreateUniversityMutation();

  const handleSave = async (universityData: CreateUniversityRequest) => {
    try {
      await createUniversityMutation.mutateAsync(universityData);
      showSuccess('University created successfully');
    } catch (error) {
      showError('Failed to create university');
      throw error;
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Create New University"
        description="Fill in the details to create a new university"
      />

      <UniversityForm
        onSave={handleSave}
        title="University Information"
        description="Enter the details for your new university."
      />
    </AdminLayout>
  );
}
