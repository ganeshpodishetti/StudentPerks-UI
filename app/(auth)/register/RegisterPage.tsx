// Migrated from src/components/pages/RegisterPage.tsx
'use client'
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { Input } from '@/shared/components/ui/input';
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

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: "Error",
        description: "Password must include uppercase, lowercase, and a number.",
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; title?: string; error?: string }; status?: number }; message?: string };
      browserConsole.error('Registration error:', error);
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.title ||
                          err.response?.data?.error ||
                          err.message ||
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
          } catch {
            // JSON parsing failed, use default error message
          }
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
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-brand-300 mb-6">
            UNLOCK YOUR CAMPUS. UNLOCK YOUR SAVINGS.
          </p>
          <h1 className="text-5xl lg:text-7xl font-black text-brand-100 leading-[0.95] tracking-tighter mb-8 uppercase">
            Join <br />
            <span className="text-brand-300">the Crowd.</span>
          </h1>
          <p className="text-lg text-brand-300/80 max-w-md leading-relaxed font-medium">
            Join thousands of students discovering verified deals and everyday savings from the brands you already love.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12 lg:left-24">
          <p className="text-[10px] font-bold text-brand-100/50 tracking-widest uppercase">© 2026 PerksCrowd Ltd.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-white dark:bg-neutral-900 relative">
        {/* Mobile Header */}
        <div className="md:hidden text-center mb-6 w-full">
           <Link href="/" className="inline-block mb-6">
            <span className="text-xl font-bold text-brand-900 dark:text-brand-100 tracking-tighter">PerksCrowd</span>
          </Link>
          <h1 className="text-4xl font-black text-brand-900 dark:text-brand-100 tracking-tight mb-2 uppercase">
            JOIN <span className="text-brand-700 dark:text-brand-400">THE CROWD.</span>
          </h1>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8 hidden md:block">
            <h2 className="text-2xl font-black text-brand-900 dark:text-brand-100 tracking-tight uppercase">Create Account</h2>
            <p className="text-brand-500 text-xs font-bold uppercase tracking-widest mt-1">VERIFIED MEMBERSHIP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block ml-1">
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
                  placeholder="name"
                  className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block ml-1">
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
                  placeholder="name@university.edu"
                  className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block ml-1">
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
                    placeholder="••••••••"
                    className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 block ml-1">
                    Confirm
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900 focus:ring-brand-500 transition-all h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-900 hover:bg-brand-700 text-brand-100 dark:bg-brand-100 dark:text-brand-900 dark:hover:bg-brand-300 h-14 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] tracking-widest uppercase text-sm"
              >
                {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] tracking-widest text-[10px]"
                disabled={isLoading}
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
                JOIN WITH GOOGLE
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <p className="text-sm font-medium text-brand-700 dark:text-brand-300 mb-6">
                Already in the crowd?{' '}
                <Link
                  href="/login"
                  className="text-brand-900 dark:text-brand-100 font-black hover:underline underline-offset-8 transition-all"
                >
                  Log In
                </Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-300">
                <Link href="/" className="hover:text-brand-900 transition-colors">← HOME</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-brand-900 transition-colors">Terms</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-brand-900 transition-colors">Privacy</Link>
              </div>
            </div>
          </form>
        </div>
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
