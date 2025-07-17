import { Button } from '@/shared/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

export interface ActionConfig<T> {
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  customActions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    onClick: (item: T) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    className?: string;
  }>;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: ActionConfig<T>;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  className = '',
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const renderCellContent = (column: ColumnDef<T>, item: T) => {
    if (column.render) {
      const value = typeof column.accessor === 'function' 
        ? column.accessor(item) 
        : column.accessor 
          ? item[column.accessor] 
          : null;
      return column.render(value, item);
    }

    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }

    if (column.accessor) {
      return item[column.accessor] as React.ReactNode;
    }

    return null;
  };

  const renderActions = (item: T) => {
    if (!actions) return null;

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {actions.onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.onEdit!(item)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
        {actions.onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.onDelete!(item.id)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
        {actions.customActions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={() => action.onClick(item)}
            className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${action.className || ''}`}
          >
            <action.icon className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`hidden md:block overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border dark:border-border hover:bg-muted dark:hover:bg-muted"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`p-2 sm:p-3 md:p-4 ${column.className || ''}`}
                >
                  {renderCellContent(column, item)}
                </td>
              ))}
              {actions && (
                <td className="p-2 sm:p-3 md:p-4">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper functions for common cell renderers
export const cellRenderers = {
  image: (imageUrl: string | null | undefined, alt: string = 'Image', fallback: string = '/no-image.svg') => (
    <div className="flex items-center">
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={alt} 
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-muted dark:bg-muted overflow-hidden">
          <Image 
            src={fallback} 
            alt="No image available" 
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  ),

  text: (text: string | null | undefined, className: string = '') => (
    <div className={`font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm ${className}`}>
      {text || '-'}
    </div>
  ),

  description: (text: string | null | undefined, maxWidth: string = 'max-w-[300px]') => (
    <div className={`text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate ${maxWidth}`}>
      {text || '-'}
    </div>
  ),

  link: (url: string | null | undefined, maxWidth: string = 'max-w-[150px]') => {
    if (!url) {
      return <span className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">-</span>;
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline text-xs sm:text-sm truncate ${maxWidth} block`}
      >
        {url}
      </a>
    );
  },

  badge: (text: string | null | undefined, variant: 'primary' | 'success' | 'danger' = 'primary') => {
    const variants = {
      primary: 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground',
      success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    
    return (
      <span className={`px-1 sm:px-2 py-1 rounded text-xs ${variants[variant]}`}>
        {text}
      </span>
    );
  },

  status: (isActive: boolean) => (
    <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
      isActive 
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  ),

  titleWithDescription: (title: string, description: string | null | undefined, maxWidth: string = 'max-w-xs') => (
    <div>
      <div className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">{title}</div>
      <div className={`text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px] sm:${maxWidth}`}>
        {description}
      </div>
    </div>
  )
};