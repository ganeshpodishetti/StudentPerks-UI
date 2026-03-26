// Migrated from src/components/pages/RegisterPage.tsx
'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { getGoogleAuthUrl } from '@/shared/config/env';
import { browserConsole } from '@/shared/utils/runtimeSafety';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: 'Google sign-in failed. Please try again.',
  oauth_missing_claims: 'Google account is missing required info (email).',
  oauth_auth_failed: 'Could not complete Google registration. Please try again.',
  rate_limited: 'Too many sign-in attempts. Please wait a moment and try again.',
};

const OAUTH_ERROR_TITLES: Record<string, string> = {
  rate_limited: 'Too Many Requests',
};

function RegisterPageInner() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuth();

  useEffect(() => {
    const errorCode = searchParams.get('error');
    if (!errorCode) return;

    const description = OAUTH_ERROR_MESSAGES[errorCode];
    if (!description) return;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.username);
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to confirm your account.",
      });
      router.push('/login'); // Redirect to login page
    } catch (error: any) {
      browserConsole.error('Registration error:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.response?.data?.error ||
                          error.message ||
                          'Failed to create account. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    fetch(getGoogleAuthUrl(), {
      method: 'GET',
      credentials: 'include',
      redirect: 'manual',
    })
      .then(async (response) => {
        if (response.status === 429) {
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
          setIsLoading(false);
        } else if (response.status === 0 || response.status === 302 || response.status === 301) {
          // status 0 indicates an 'opaqueredirect', which means the server returned a 3xx
          window.location.href = getGoogleAuthUrl();
        } else {
          toast({
            title: 'Error',
            description: 'Unexpected response from server. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      })
      .catch(() => {
        // Fallback to direct redirect if fetch fails for any reason
        window.location.href = getGoogleAuthUrl();
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 underline"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="w-full"
                />
              </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                className="w-full"
                size="lg"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </Button>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full text-center">
                <Link
                  href="/"
                  className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white inline-flex items-center justify-center"
                >
                  ← Back to home
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
