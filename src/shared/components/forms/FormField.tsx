// Placeholder FormField component
import React from 'react';

interface FormFieldProps {
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ children }) => {
  return <div className="form-field">{children}</div>;
};