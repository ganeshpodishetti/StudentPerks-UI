'use client'
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminSubmittedDealsList from '@/components/admin/AdminSubmittedDealsList';
import SubmittedDealStats from '@/components/admin/SubmittedDealStats';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminSubmittedDeals } from '@/hooks/useAdminSubmittedDeals';

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
