import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface AdminLoadingSpinnerProps {
  message?: string;
}

export default function AdminLoadingSpinner({ message = "Loading..." }: AdminLoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-muted-foreground text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
