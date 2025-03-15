'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0 },
  };

  // Link hover animation
  const linkHoverAnimation = {
    rest: { width: 0 },
    hover: { width: '100%' },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span
                className="font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚽ Footy Genius
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {['/', '/challenges', '/battles', '/leaderboard'].map(
                (path) => {
                  const isActiveLink = isActive(path);
                  const label =
                    path === '/'
                      ? 'Home'
                      : path.substring(1).charAt(0).toUpperCase() +
                        path.substring(2);

                  return (
                    <Link
                      key={path}
                      href={path}
                      className="relative text-sm font-medium transition-colors group"
                    >
                      <span
                        className={`${
                          isActiveLink
                            ? 'text-foreground'
                            : 'text-foreground/60 group-hover:text-foreground'
                        }`}
                      >
                        {label}
                      </span>
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                        initial="rest"
                        animate={isActiveLink ? 'hover' : 'rest'}
                        whileHover="hover"
                        variants={linkHoverAnimation}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  );
                }
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={session.user.image || ''}
                        alt={session.user.name || ''}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {session.user.name?.charAt(0) ||
                          session.user.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-accent">
                    <Link
                      href="/profile"
                      className="w-full flex items-center gap-2 py-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg focus:bg-accent"
                    onClick={() => signOut()}
                  >
                    <div className="w-full flex items-center gap-2 py-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-log-out"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sign Out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-xl hover:bg-muted"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="rounded-xl">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground rounded-xl"
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden fixed inset-y-0 right-0 w-3/4 bg-card/95 backdrop-blur-md z-50 shadow-xl border-l border-border pt-16"
        initial="closed"
        animate={mobileMenuOpen ? 'open' : 'closed'}
        variants={mobileMenuVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <nav className="flex flex-col p-4 gap-2">
          {['/', '/challenges', '/battles', '/leaderboard'].map((path) => {
            const isActiveLink = isActive(path);
            const label =
              path === '/'
                ? 'Home'
                : path.substring(1).charAt(0).toUpperCase() +
                  path.substring(2);

            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-lg font-medium ${
                  isActiveLink
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            );
          })}

          {session && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl text-lg font-medium hover:bg-muted text-foreground/70 hover:text-foreground"
            >
              Profile
            </Link>
          )}

          {session ? (
            <Button
              variant="ghost"
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="justify-start p-3 rounded-xl text-lg font-medium hover:bg-destructive/10 text-destructive"
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="outline"
                asChild
                className="w-full rounded-xl"
              >
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full rounded-xl">
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
