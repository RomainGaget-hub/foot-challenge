'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/30">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Link href="/" className="flex items-center space-x-2">
                <motion.span
                  className="font-bold text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚽ Footy Genius
                </motion.span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Test your football knowledge with our interactive
                challenges and competitions.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Explore</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Challenges', href: '/challenges' },
                  { name: 'Battles', href: '/battles' },
                  { name: 'Leaderboard', href: '/leaderboard' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Account</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Sign In', href: '/sign-in' },
                  { name: 'Sign Up', href: '/sign-up' },
                  { name: 'Profile', href: '/profile' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t text-sm text-muted-foreground">
            <p>&copy; {currentYear} Footy Genius. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
