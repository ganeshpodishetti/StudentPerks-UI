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
  rate_limited: 'Too many sign-in attempts. Please wait a moment and try again.',
};

const OAUTH_ERROR_TITLES: Record<string, string> = {
  rate_limited: 'Too Many Requests',
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
      title: OAUTH_ERROR_TITLES[errorCode] ?? 'Error',
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
    <div className="flex flex-col md:flex-row h-screen min-h-screen w-full overflow-hidden bg-background">
      {/* Branding Side */}
      <div className="hidden md:flex flex-1 bg-brand-900 dark:bg-brand-950 relative overflow-hidden flex-col justify-center px-12 lg:px-24">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-brand-300/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10 max-w-xl">
          <Link href="/" className="inline-block mb-12">
            <span className="text-2xl font-bold text-brand-100 tracking-tighter">PerksCrowd</span>
          </Link>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-brand-500 mb-6">
            ESTABLISHED PERKS. VERIFIED SAVINGS.
          </p>
          <h1 className="text-5xl lg:text-7xl font-black text-brand-100 leading-[0.95] tracking-tighter mb-8 uppercase">
            Welcome <br />
            <span className="text-brand-500">Back.</span>
          </h1>
          <p className="text-lg text-brand-300/80 max-w-md leading-relaxed font-medium">
            Sign in to access your curated dashboard of everyday student savings and verified campus offers.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12 lg:left-24">
          <p className="text-[10px] font-bold text-brand-700 tracking-widest uppercase">© 2026 PerksCrowd Ltd.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-white dark:bg-neutral-900 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden text-center mb-10 w-full">
           <Link href="/" className="inline-block mb-8">
            <span className="text-xl font-bold text-brand-900 dark:text-brand-100 tracking-tighter">PerksCrowd</span>
          </Link>
          <h1 className="text-4xl font-black text-brand-900 dark:text-brand-100 tracking-tight mb-2 uppercase">
            WELCOME <span className="text-brand-500">BACK.</span>
          </h1>
          <p className="text-brand-700 dark:text-brand-300 text-sm font-medium">
            Access your verified perks dashboard.
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-10 hidden md:block">
            <h2 className="text-2xl font-black text-brand-900 dark:text-brand-100 tracking-tight uppercase">Account Login</h2>
            <p className="text-brand-500 text-xs font-bold uppercase tracking-widest mt-1">SECURE ACCESS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block ml-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-wider text-brand-300 hover:text-brand-900 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-12"
              />
            </div>

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-brand-900 hover:bg-brand-700 text-brand-100 dark:bg-brand-100 dark:text-brand-900 dark:hover:bg-brand-300 h-14 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] tracking-widest uppercase text-sm"
                disabled={isSubmitting || isGoogleRedirecting}
              >
                {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
              </Button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100 dark:border-neutral-800 opacity-50" />
                </div>
                <div className="relative flex justify-center text-[10px] items-center">
                  <span className="bg-white dark:bg-neutral-900 px-3 font-bold text-brand-300 uppercase tracking-[0.2em]">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] tracking-widest text-[10px]"
                disabled={isSubmitting || isGoogleRedirecting}
                onClick={handleGoogleLogin}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </Button>
            </div>

            <div className="mt-12 space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  New to the crowd?{' '}
                  <Link
                    href="/register"
                    className="text-brand-900 dark:text-brand-100 font-black hover:underline underline-offset-8 transition-all"
                  >
                    Create Account
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-300">
                  <Link href="/terms" className="hover:text-brand-900">Terms</Link>
                  <span>•</span>
                  <Link href="/privacy" className="hover:text-brand-900">Privacy</Link>
                  <span>•</span>
                  <Link href="/resend-confirmation" className="hover:text-brand-900">Verify</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
