import { AdminLayoutProps } from '@/types/common/ComponentProps';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  actions,
  navigation,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        {(title || actions) && (
          <div className="flex items-center justify-between">
            {title && (
              <h1 className="text-3xl font-bold tracking-tight">
                {title}
              </h1>
            )}
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {navigation}

        {/* Content */}
        <main className="space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
