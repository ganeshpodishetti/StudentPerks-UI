// Migrated from src/components/pages/AdminDashboard.tsx
'use client'
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminStats from '@/components/admin/AdminStats';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

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
        <AdminStats deals={deals} />
        <AdminOverview deals={deals} />
      </div>
    </AdminLayout>
  );
}
// ...original code will be placed here...
