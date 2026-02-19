// Migrated from src/components/pages/AdminSubmittedDealsPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminNavigation from '@/features/admin/components/layout/AdminNavigation/AdminNavigation';
import SubmittedDealStats from '@/features/admin/components/stats/SubmittedDealStats/SubmittedDealStats';
import AdminSubmittedDealsList from '@/features/admin/components/tables/AdminSubmittedDealsList/AdminSubmittedDealsList';
import { useAdminSubmittedDeals } from '@/features/admin/hooks/useAdminSubmittedDeals';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  const isSuperAdmin = authUser?.roles?.includes('SuperAdmin') ?? false;
  
  // Redirect non-SuperAdmin users to admin dashboard
  useEffect(() => {
    if (!isLoading && authUser && !isSuperAdmin) {
      router.replace('/admin');
    }
  }, [isLoading, authUser, isSuperAdmin, router]);

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }
  
  // Don't render if not SuperAdmin
  if (!isSuperAdmin) {
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
