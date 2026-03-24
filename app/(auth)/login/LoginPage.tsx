// Migrated from src/components/pages/LoginPage.tsx
'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useAuthRedirect } from '@/features/auth/hooks/useAuthRedirect';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from "@/shared/components/ui/use-toast";
import { getGoogleAuthUrl } from '@/shared/config/env';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: 'Google sign-in failed. Please try again.',
  oauth_missing_claims: 'Google account is missing required info (email).',
  oauth_auth_failed: 'Could not complete Google login. Please try again.',
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    whenAuthenticated: '/dashboard',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleLogin = () => {
    setIsGoogleRedirecting(true);
    fetch(getGoogleAuthUrl(), {
      method: 'GET',
      credentials: 'include',
      redirect: 'manual',
    })
      .then(async (response) => {
        if (response.status === 429) {
          // Try to parse error JSON, fallback to default message
          let errorMsg = 'You have exceeded the request rate limit. Please wait and retry.';
          try {
            const data = await response.json();
            errorMsg = data.detail || errorMsg;
          } catch {}
          toast({
            title: 'Too Many Requests',
            description: errorMsg,
            variant: 'destructive',
          });
          setIsGoogleRedirecting(false);
        } else if (response.status === 0 || response.status === 302 || response.status === 301) {
          // status 0 indicates an 'opaqueredirect', which means the server returned a 3xx
          // Not rate-limited, proceed with redirect
          window.location.href = getGoogleAuthUrl();
        } else {
          // Unexpected response
          toast({
            title: 'Error',
            description: 'Unexpected response from server. Please try again.',
            variant: 'destructive',
          });
          setIsGoogleRedirecting(false);
        }
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Network error. Please try again.',
          variant: 'destructive',
        });
        setIsGoogleRedirecting(false);
      });
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
      router.replace('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.message ||
                          "An error occurred during login";
      
      const statusCode = error.response?.status;
      const errorDetail = error.response?.data?.detail || '';
      
      // Check if error is related to email confirmation
      // Only redirect to email verification if the message specifically mentions confirmation/verification
      // Do NOT redirect for "Invalid Email or Password!" errors
      const isEmailNotConfirmed =
        statusCode === 403 &&
        !errorDetail.toLowerCase().includes('invalid') &&
        (errorMessage.toLowerCase().includes('confirm') ||
         errorMessage.toLowerCase().includes('verify') ||
         errorMessage.toLowerCase().includes('not confirmed') ||
         errorDetail.toLowerCase().includes('confirm') ||
         errorDetail.toLowerCase().includes('verify'));
      
      if (isEmailNotConfirmed) {
        // Show message and redirect to resend confirmation page
        toast({
          title: "Email Verification Required",
          description: "For security reasons, you must verify your email address before logging in. Redirecting you to resend confirmation email...",
          variant: "default",
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
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  React.useEffect(() => {
    const errorCode = searchParams.get('error');
    if (!errorCode) {
      return;
    }

    const description = OAUTH_ERROR_MESSAGES[errorCode];
    if (!description) {
      return;
    }

    toast({
      title: 'Error',
      description,
      variant: 'destructive',
    });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('error');
    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl);
  }, [pathname, router, searchParams, toast]);

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
                disabled={isSubmitting || isGoogleRedirecting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <Button
                type="button"
                className="w-full"
                disabled={isSubmitting || isGoogleRedirecting}
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                By continuing, you agree to PerksCrowd&apos;s{' '}
                <Link href="/terms" className="underline hover:text-primary">Terms of Use</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </div>
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
