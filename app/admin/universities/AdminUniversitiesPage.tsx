// Migrated from src/components/pages/AdminUniversitiesPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminUniversitiesList from '@/features/admin/components/tables/AdminUniversitiesList/AdminUniversitiesList';
import { useAdminUniversities } from '@/features/admin/hooks/useAdminUniversities';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Export hook for university selection in other components
export const useUniversityOptions = () => {
  const { universities, isLoading } = useAdminUniversities();
  
  const universityOptions = universities?.map(university => ({
    value: university.id,
    label: university.name
  })) || [];

  return { universityOptions, isLoading };
};

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const {
    universities,
    isLoading,
    user,
    handleDeleteUniversity,
  } = useAdminUniversities();

  const { } = useAuth();
  
  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

  const handleCreateUniversity = () => {
    router.push('/admin/universities/new');
  };

  const handleEditUniversity = (universityId: string) => {
    router.push(`/admin/universities/${universityId}/edit`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="University Management"
        description="Manage universities and their deals"
        onCreateAction={handleCreateUniversity}
        createButtonText="Create University"
      />

      <AdminUniversitiesList 
        universities={universities}
        onEditUniversity={isSuperAdmin ? handleEditUniversity : undefined}
        onDeleteUniversity={isSuperAdmin ? handleDeleteUniversity : undefined}
      />
    </AdminLayout>
  );
}
