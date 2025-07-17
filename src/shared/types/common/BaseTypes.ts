// Base types for components and forms
export interface BaseFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive';

export interface BaseComponentProps {
  className?: string;
  size?: ComponentSize;
  variant?: ComponentVariant;
}