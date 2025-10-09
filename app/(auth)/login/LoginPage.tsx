// Migrated from src/components/pages/LoginPage.tsx
'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from "@/shared/components/ui/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading, user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // router.push('/admin'); // Remove direct push, let useEffect handle it
    } catch (error: any) {
      console.log('Login error:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.message ||
                          "An error occurred during login";
      
      const statusCode = error.response?.status;
      
      // Check if error is related to email confirmation
      // 403 Forbidden typically means email not confirmed
      const isEmailNotConfirmed =
        statusCode === 403 ||
        (errorMessage.toLowerCase().includes('email') &&
         (errorMessage.toLowerCase().includes('confirm') ||
          errorMessage.toLowerCase().includes('verify') ||
          errorMessage.toLowerCase().includes('not confirmed')));
      
      if (isEmailNotConfirmed) {
        // Show message and redirect to resend confirmation page
        toast({
          title: "Email Verification Required",
          description: "For security reasons, you must verify your email address before logging in. Redirecting you to resend confirmation email...",
          variant: "default",
          duration: 3000,
        });
        
        // Redirect to resend confirmation page with email pre-filled
        setTimeout(() => {
          router.push(`/resend-confirmation?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to /admin if authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full space-y-2">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Need to verify your email?{' '}
                <Link
                  href="/resend-confirmation"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Resend confirmation email
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
