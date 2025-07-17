// Placeholder FormActions component
import React from 'react';

interface FormActionsProps {
  children: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({ children }) => {
  return <div className="form-actions flex gap-2 justify-end">{children}</div>;
};