// Migrated from src/components/pages/AdminDashboard.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminOverview from '@/features/admin/components/dashboard/AdminOverview/AdminOverview';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminStats from '@/features/admin/components/stats/AdminStats/AdminStats';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';

export default function AdminDashboard() {
  const {
    deals,
    isLoading,
    user,
  } = useAdminDashboard();

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
        title="Dashboard"
        description={`Welcome back, ${user?.firstName}! Here's an overview of your content.`}
      />

      <div className="space-y-6">
        <AdminStats deals={deals} />
        <AdminOverview deals={deals} />
      </div>
    </AdminLayout>
  );
}
