'use client'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUnreadDealsCount } from '@/hooks/useUnreadDealsCount';
import { cn } from '@/lib/utils';
import { GraduationCap, LayoutDashboard, MessagesSquare, ShoppingBag, Store, Tag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavigation() {
  const pathname = usePathname();
  const { unreadCount } = useUnreadDealsCount();

  const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/deals',
      label: 'Deals',
      icon: ShoppingBag,
    },
    {
      path: '/admin/submitted-deals',
      label: 'Submitted Deals',
      icon: MessagesSquare,
    },
    {
      path: '/admin/stores',
      label: 'Stores', 
      icon: Store,
    },
    {
      path: '/admin/categories',
      label: 'Categories',
      icon: Tag,
    },
    {
      path: '/admin/universities',
      label: 'Universities',
      icon: GraduationCap,
    },
  ];

  return (
    <Card>
      <CardContent>
        <nav className="flex space-x-0 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center space-x-2 py-4 px-6 border-b-2 transition-all duration-200 whitespace-nowrap relative hover:bg-card dark:hover:bg-card",
                  isActive
                    ? "border-primary text-primary bg-card dark:bg-card"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.path === '/admin/submitted-deals' && unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
