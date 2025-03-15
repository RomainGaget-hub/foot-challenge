'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { MainLayout } from '@/components/main-layout';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 sm:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="w-full max-w-md px-4 mx-auto"
        >
          <Card className="glassmorphism overflow-hidden shadow-xl border-white/10 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <motion.div variants={itemVariants}>
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Sign in
                </CardTitle>
                <CardDescription>
                  Enter your email and password to sign in to your account
                </CardDescription>
              </CardHeader>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                    className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email" className="text-foreground/90">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-11 focus-glow"
                    required
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-foreground/90"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl h-11 focus-glow"
                    required
                  />
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  className="w-full"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  className="text-center text-sm"
                  variants={itemVariants}
                >
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
