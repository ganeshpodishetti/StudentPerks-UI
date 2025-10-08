import { Suspense } from 'react';
import ConfirmEmailPage from './ConfirmEmailPage';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ConfirmEmailPage />
    </Suspense>
  );
}