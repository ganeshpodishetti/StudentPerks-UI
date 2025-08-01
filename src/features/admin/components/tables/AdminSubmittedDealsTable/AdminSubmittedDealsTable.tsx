import { Button } from '@/shared/components/ui/button';
import { ColumnDef } from '@/shared/components/data-display/DataTable';
import { SubmittedDeal } from '@/shared/types/entities/submittedDeal';
import { CheckCircle, ExternalLink, Trash2, XCircle } from 'lucide-react';

interface AdminSubmittedDealsTableProps {
  deals: SubmittedDeal[];
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminSubmittedDealsTable({ deals, onMarkAsRead, onDelete }: AdminSubmittedDealsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: ColumnDef<SubmittedDeal>[] = [
    {
      key: 'name',
      header: 'Deal Name',
      render: (_, deal) => (
        <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
          {deal.name}
        </div>
      ),
      className: 'text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'
    },
    {
      key: 'url',
      header: 'URL',
      render: (_, deal) => (
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
            {deal.url}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-6 w-6 p-0"
          >
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      ),
      className: 'text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'
    },
    {
      key: 'submitted',
      header: 'Submitted',
      render: (_, deal) => (
        <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(deal.sentAt)}
        </span>
      ),
      className: 'text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, deal) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          deal.markedAsRead 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
        } bg-muted dark:bg-muted`}>
          {deal.markedAsRead ? 'Read' : 'Unread'}
        </span>
      ),
      className: 'text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'
    }
  ];

  // For this complex case with conditional actions, let's use a custom render
  if (deals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 dark:text-neutral-400">No submitted deals found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left p-2 sm:p-3 md:p-4 ${column.className || 'font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm'}`}
              >
                {column.header}
              </th>
            ))}
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b border-border dark:border-border hover:bg-muted dark:hover:bg-muted">
              {columns.map((column) => (
                <td key={column.key} className="p-2 sm:p-3 md:p-4">
                  {column.render ? column.render(null, deal) : null}
                </td>
              ))}
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  {!deal.markedAsRead ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(deal.id, true)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(deal.id, false)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      title="Mark as unread"
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(deal.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
