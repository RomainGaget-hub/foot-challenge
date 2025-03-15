'use client';

import { ReactNode } from 'react';
import { MotionConfig, AnimatePresence } from 'framer-motion';

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </MotionConfig>
  );
}
