'use client'
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useToast } from '@/shared/components/ui/use-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ConfirmationStatus = 'loading' | 'success' | 'error';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. No token provided.');
        return;
      }

      try {
        const response = await authService.confirmEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email has been confirmed successfully!');
        toast({
          title: "Success",
          description: "Email confirmed successfully! You can now log in.",
        });
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.title ||
                           error.message || 
                           'Failed to confirm email. The link may be invalid or expired.';
        setMessage(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    confirmEmail();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl text-center">
              {status === 'loading' && 'Confirming Email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'Please wait while we confirm your email address.'}
              {status === 'success' && 'Your email has been successfully verified.'}
              {status === 'error' && 'We encountered an issue confirming your email.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              {message}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            {status === 'success' && (
              <Button asChild className="w-full" size="lg">
                <Link href="/login">
                  Continue to Login
                </Link>
              </Button>
            )}
            
            {status === 'error' && (
              <div className="w-full space-y-2">
                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/register">
                    Register Again
                  </Link>
                </Button>
                <Button asChild className="w-full" size="lg" variant="ghost">
                  <Link href="/login">
                    Try to Login
                  </Link>
                </Button>
              </div>
            )}

            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                ← Back to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}