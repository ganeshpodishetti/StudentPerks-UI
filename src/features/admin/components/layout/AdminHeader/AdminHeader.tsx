import ThemeToggle from '@/shared/components/layout/ThemeToggle/ThemeToggle';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import AdminDealsSearchBar from '../../tables/AdminDealsSearchBar/AdminDealsSearchBar';

interface AdminHeaderProps {
  title?: string;
  description?: string;
  onCreateAction?: () => void;
  createButtonText?: string;
  onSearchDeals?: (term: string) => void;
}

export default function AdminHeader({
  title = "Dashboard",
  description,
  onCreateAction,
  createButtonText = "Create",
  onSearchDeals
}: AdminHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-3">
          {onSearchDeals && (
            <div className="hidden sm:block">
              <AdminDealsSearchBar onSearch={onSearchDeals} placeholder="Search..." />
            </div>
          )}
          <ThemeToggle />
          {onCreateAction && (
            <Button
              onClick={onCreateAction}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{createButtonText}</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      {onSearchDeals && (
        <div className="mt-4 sm:hidden">
          <AdminDealsSearchBar onSearch={onSearchDeals} placeholder="Search..." />
        </div>
      )}
    </div>
  );
}
