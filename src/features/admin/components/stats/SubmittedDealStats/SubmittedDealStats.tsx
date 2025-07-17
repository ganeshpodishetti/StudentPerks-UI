import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Mail, MailOpen, MessagesSquare } from 'lucide-react';

interface SubmittedDealStatsProps {
  total: number;
  unread: number;
  read: number;
}

export default function SubmittedDealStats({ total, unread, read }: SubmittedDealStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <MessagesSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{total}</div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Deal submissions received
          </p>
        </CardContent>
      </Card>

      <Card className={unread > 0 ? 'ring-2 ring-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unread</CardTitle>
          <div className="relative">
            <Mail className="h-4 w-4 text-yellow-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-3 w-3 flex items-center justify-center"></span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-xl sm:text-2xl font-bold ${unread > 0 ? 'text-yellow-600 dark:text-yellow-400 animate-pulse' : 'text-yellow-600 dark:text-yellow-400'}`}>
            {unread}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {unread > 0 ? 'Require attention' : 'All caught up!'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Read</CardTitle>
          <MailOpen className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
            {read}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Already reviewed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
