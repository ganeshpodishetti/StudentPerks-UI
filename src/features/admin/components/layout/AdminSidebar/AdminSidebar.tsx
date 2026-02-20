'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useUnreadDealsCount } from '@/features/deals/hooks/useUnreadDealsCount';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import {
    ChevronLeft,
    GraduationCap,
    Home,
    LayoutDashboard,
    LogOut,
    MessagesSquare,
    ShoppingBag,
    Store,
    Tag,
    User as UserIcon,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    requiresSuperAdmin: false,
  },
  {
    path: '/admin/deals',
    label: 'Deals',
    icon: ShoppingBag,
    requiresSuperAdmin: false,
  },
  {
    path: '/admin/submitted-deals',
    label: 'Submitted Deals',
    icon: MessagesSquare,
    requiresSuperAdmin: true,
  },
  {
    path: '/admin/stores',
    label: 'Stores',
    icon: Store,
    requiresSuperAdmin: false,
  },
  {
    path: '/admin/categories',
    label: 'Categories',
    icon: Tag,
    requiresSuperAdmin: false,
  },
  {
    path: '/admin/universities',
    label: 'Universities',
    icon: GraduationCap,
    requiresSuperAdmin: false,
  },
  {
    path: '/admin/profile',
    label: 'Profile',
    icon: UserIcon,
    requiresSuperAdmin: false,
  },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useUnreadDealsCount();
  const { user, logout } = useAuth();

  const isSuperAdmin = user?.roles?.includes('SuperAdmin') ?? false;

  const visibleNavItems = navItems.filter(item =>
    !item.requiresSuperAdmin || isSuperAdmin
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 flex-1">
      {/* Logo/Brand */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-800",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SP</span>
            </div>
            <span className="font-semibold text-lg">Admin</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SP</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:flex h-8 w-8",
            isCollapsed && "absolute -right-3 top-6 bg-background border shadow-sm"
          )}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="lg:hidden h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.path === '/admin/submitted-deals' && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto text-xs px-1.5 py-0.5 h-5 min-w-[20px] flex items-center justify-center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </>
              )}
              {isCollapsed && item.path === '/admin/submitted-deals' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="shrink-0" />

      {/* Back to site link */}
      <div className={cn("p-3 shrink-0", isCollapsed && "px-2")}>
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground group relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Back to Site</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Back to Site
            </div>
          )}
        </Link>
      </div>

      <Separator className="shrink-0" />

      {/* Logout section */}
      <div className={cn(
        "p-3 shrink-0",
        isCollapsed && "px-2"
      )}>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-destructive hover:text-destructive hover:bg-destructive/10 group relative",
            isCollapsed ? "px-2 justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-card border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 flex flex-col overflow-hidden",
          isCollapsed ? "w-[68px]" : "w-64",
          // Mobile: hidden by default, shown when isMobileOpen
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
