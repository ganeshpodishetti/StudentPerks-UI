'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import UserProfile from '@/features/admin/components/profile/UserProfile/UserProfile';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export default function AdminProfilePage() {
  const { user, isLoading } = useAuth();

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
        title="Profile"
        description="Your account information and details"
      />

      <UserProfile user={user} />
    </AdminLayout>
  );
}
