// Migrated from src/components/pages/AdminSubmittedDealsPage.tsx
'use client'
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import AdminSubmittedDealsList from '@/features/admin/components/tables/AdminSubmittedDealsList/AdminSubmittedDealsList';
import SubmittedDealStats from '@/features/admin/components/stats/SubmittedDealStats/SubmittedDealStats';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAdminSubmittedDeals } from '@/features/admin/hooks/useAdminSubmittedDeals';

export default function AdminSubmittedDealsPage() {
  const {
    deals,
    isLoading,
    user,
    stats,
    handleMarkAsRead,
    handleDelete,
    handleLogout,
    testConnectivity,
  } = useAdminSubmittedDeals();

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
        title="Submitted Deals"
      />

      <div className="space-y-6">
        {/* Stats */}
        <SubmittedDealStats {...stats} />

        {/* Submitted Deals List */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Submissions</CardTitle>
            <CardDescription>
              Review and manage user-submitted deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminSubmittedDealsList 
              deals={deals}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
// ...original code will be placed here...
