'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// Animation variants for page transitions
const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        key={pathname}
        className="flex-1 w-full"
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          {children}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
