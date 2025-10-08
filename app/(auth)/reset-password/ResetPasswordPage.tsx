'use client'
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const tokenParam = searchParams.get('token');
      
      if (!tokenParam) {
        setValidationError('No reset token provided. Please request a new password reset link.');
        setIsValidating(false);
        return;
      }

      setToken(tokenParam);
      setIsValidating(true);

      try {
        await authService.validateResetToken(tokenParam);
        setIsTokenValid(true);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.title ||
                            error.message || 
                            'Invalid or expired reset token. Please request a new password reset link.';
        setValidationError(errorMessage);
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmNewPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset token.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, newPassword, confirmNewPassword);
      setPasswordReset(true);
      toast({
        title: "Success",
        description: response.message || "Your password has been reset successfully!",
        duration: 7000,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title ||
                          error.message || 
                          'Failed to reset password. Please try again or request a new reset link.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              </div>
              <CardTitle className="text-2xl text-center">
                Validating Reset Link
              </CardTitle>
              <CardDescription className="text-center">
                Please wait while we verify your password reset link...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-center">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-center">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                <p className="mb-2">{validationError}</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link href="/forgot-password">
                  Request New Reset Link
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login">
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">
                Password Reset Successful!
              </CardTitle>
              <CardDescription className="text-center">
                Your password has been changed successfully
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                <p className="mb-2">You can now log in with your new password.</p>
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

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Lock className="h-16 w-16 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-center">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full"
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirm New Password
                </label>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full"
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-1">🔒 Password Requirements</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Both passwords must match</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <div className="w-full text-center text-sm text-neutral-600 dark:text-neutral-400">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}