'use client'
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Deal } from '@/shared/types/entities/deal';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface AdminOverviewProps {
  deals: Deal[];
}

export default function AdminOverview({ deals }: AdminOverviewProps) {
  // Calculate some basic stats
  const recentDeals = deals
    .filter(deal => deal.isActive)
    .sort((a, b) => new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime())
    .slice(0, 5);

  const expiringDeals = deals
    .filter(deal => {
      if (!deal.endDate) return false;
      const endDate = new Date(deal.endDate);
      const now = new Date();
      const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    })
    .slice(0, 3);

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6">
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Active Deals
            </CardTitle>
            <CardDescription>Latest deals added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeals.length > 0 ? (
              <div className="space-y-2">
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="flex justify-between items-start p-2 bg-card dark:bg-card rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {deal.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {deal.storeName} • {deal.discount}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href="/admin/deals">View All Deals</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No deals available</p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Deals expiring within 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {expiringDeals.length > 0 ? (
              <div className="space-y-2">
                {expiringDeals.map((deal) => (
                  <div key={deal.id} className="flex justify-between items-start p-2 bg-muted dark:bg-muted rounded border border-border dark:border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {deal.title}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Expires: {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : 'No end date'}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full mt-3">
                  <Link href="/admin/deals">Manage Expiring Deals</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No deals expiring soon</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
