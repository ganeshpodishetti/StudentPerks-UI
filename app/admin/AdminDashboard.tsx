// Migrated from src/components/pages/AdminDashboard.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminOverview from '@/features/admin/components/dashboard/AdminOverview/AdminOverview';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import UserProfile from '@/features/admin/components/profile/UserProfile/UserProfile';
import AdminStats from '@/features/admin/components/stats/AdminStats/AdminStats';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';

export default function AdminDashboard() {
  const {
    deals,
    isLoading,
    user,
    handleLogout,
    testConnectivity
  } = useAdminDashboard();

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout
      navigation={<AdminNavigation />}
    >
      <AdminHeader
        user={user}
        onLogout={handleLogout}
        onTestConnectivity={testConnectivity}
        title="Dashboard"
      />

      <div className="space-y-6">
        <UserProfile user={user} />
        <AdminStats deals={deals} />
        <AdminOverview deals={deals} />
      </div>
    </AdminLayout>
  );
}
