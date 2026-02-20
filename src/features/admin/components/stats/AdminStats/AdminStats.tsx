import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Deal } from '@/shared/types/entities/deal';
import { CheckCircle, Eye } from 'lucide-react';

interface AdminStatsProps {
  deals: Deal[];
}

export default function AdminStats({ deals }: AdminStatsProps) {
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => deal.isActive).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      <Card className="border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Deals</CardTitle>
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalDeals}</div>
        </CardContent>
      </Card>
      
      <Card className="border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Active Deals</CardTitle>
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{activeDeals}</div>
        </CardContent>
      </Card>
    </div>
  );
}
