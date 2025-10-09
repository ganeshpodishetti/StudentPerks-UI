'use client'
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResendConfirmationPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  // Pre-fill email from query parameter if provided
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resendConfirmationEmail(email);
      setEmailSent(true);
      toast({
        title: "Success",
        description: response.message || "Confirmation email sent! Please check your inbox.",
        duration: 7000,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title ||
                          error.message || 
                          'Failed to send confirmation email. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">
                Email Sent!
              </CardTitle>
              <CardDescription className="text-center">
                We&apos;ve sent a confirmation email to your inbox
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                <p className="mb-2">Please check your email and click the confirmation link to verify your account.</p>
                <p className="text-xs">If you don&apos;t see the email, check your spam folder.</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link href="/login">
                  Continue to Login
                </Link>
              </Button>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-16 w-16 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-center">
              Resend Confirmation Email
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a new confirmation link
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-1">📧 Email Verification Required</p>
                <p>For security reasons, you must verify your email address before you can log in. This helps protect your account and ensures you can recover access if needed.</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Sending...' : 'Send Confirmation Email'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <div className="w-full text-center text-sm text-neutral-600 dark:text-neutral-400">
                <Link
                  href="/login"
                  className="hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Back to Login
                </Link>
              </div>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">
                  ← Back to Home
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}