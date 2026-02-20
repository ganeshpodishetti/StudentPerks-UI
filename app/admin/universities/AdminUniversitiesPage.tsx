// Migrated from src/components/pages/AdminUniversitiesPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminUniversitiesList from '@/features/admin/components/tables/AdminUniversitiesList/AdminUniversitiesList';
import { useAdminUniversities } from '@/features/admin/hooks/useAdminUniversities';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import UniversityFormModal from '@/features/universities/components/forms/UniversityFormModal/UniversityFormModal';

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
  const {
    universities,
    isLoading,
    isModalOpen,
    editingUniversity,
    user,
    handleCreateUniversity,
    handleEditUniversity,
    handleDeleteUniversity,
    handleSaveUniversity,
    closeModal
  } = useAdminUniversities();

  const { } = useAuth();
  
  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

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

      <UniversityFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveUniversity}
        university={editingUniversity}
      />
    </AdminLayout>
  );
}
