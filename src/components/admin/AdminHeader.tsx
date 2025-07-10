import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, LogOut, Plus } from 'lucide-react';
import AdminDealsSearchBar from './AdminDealsSearchBar';

interface AdminHeaderProps {
  user: {
    firstName?: string;
  } | null;
  onCreateDeal?: () => void;
  onLogout: () => void;
  onTestConnectivity: () => void;
  title?: string;
  createButtonText?: string;
  onSearchDeals?: (term: string) => void;
}

export default function AdminHeader({ 
  user, 
  onCreateDeal, 
  onLogout, 
  onTestConnectivity,
  title = "Admin Dashboard",
  createButtonText = "Create Deal",
  onSearchDeals
}: AdminHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}! Manage your {title.toLowerCase().includes('dashboard') ? 'content' : title.toLowerCase()} here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {onSearchDeals && (
              <div className="flex items-center gap-2">
                <AdminDealsSearchBar onSearch={onSearchDeals} placeholder="Search deals..." />
              </div>
            )}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                onClick={onTestConnectivity} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Test API
              </Button>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-6" />
            <div className="flex gap-2">
              {onCreateDeal && (
                <Button 
                  onClick={onCreateDeal}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {createButtonText}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onLogout} 
                size="sm"
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
