// Migrated from src/components/pages/AdminUniversitiesPage.tsx
'use client'
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import AdminUniversitiesList from '@/features/admin/components/tables/AdminUniversitiesList/AdminUniversitiesList';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import UniversityFormModal from '@/features/universities/components/forms/UniversityFormModal/UniversityFormModal';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useAdminUniversities } from '@/features/admin/hooks/useAdminUniversities';

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

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout navigation={<AdminNavigation />}>
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateUniversity}
        onLogout={handleLogout}
        onTestConnectivity={() => {}}
        title="University Management"
        createButtonText="Create University"
      />

       <AdminUniversitiesList 
              universities={universities}
              onEditUniversity={handleEditUniversity}
              onDeleteUniversity={handleDeleteUniversity}
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
// ...original code will be placed here...
