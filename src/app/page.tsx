'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/main-layout';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function Home() {
  const [text] = useTypewriter({
    words: [
      'Can you guess the player?',
      'Test your football knowledge!',
      'Challenge your friends!',
    ],
    loop: true,
    delaySpeed: 2000,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <motion.div
          className="flex flex-col items-center space-y-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-3" variants={itemVariants}>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none leading-relaxed py-2">
              <span className="block gradient-bg bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent py-8 ">
                {text}
                <Cursor cursorStyle="_" />
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl py-4 leading-relaxed">
              Guess the player from their career history. Challenge friends
              and climb the leaderboard.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-xl shadow-lg w-full sm:w-auto px-8"
              >
                <Link href="/challenges">Start Playing Now!</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-xl border-2 w-full sm:w-auto px-8"
              >
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Top Players */}
      <section className="w-full py-12 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Top Players</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 justify-center min-w-max px-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    {i <= 3 && (
                      <div
                        className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 1
                            ? 'bg-yellow-500 text-black'
                            : i === 2
                            ? 'bg-gray-300 text-black'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        {i}
                      </div>
                    )}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center text-xl font-bold">
                      {/* Replace with actual avatar image */}
                      {String.fromCharCode(64 + i)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">Player {i}</div>
                    <div className="text-sm text-muted-foreground">
                      {1000 - i * 50} pts
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                  />
                </svg>
              ),
              title: 'Test Your Knowledge',
              description:
                'Challenge yourself with our database of football players and their career histories.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              ),
              title: 'Battle Friends',
              description:
                'Challenge your friends to head-to-head battles and see who knows more about football.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                  />
                </svg>
              ),
              title: 'Climb the Leaderboard',
              description:
                'Earn points for correct answers and see how you rank against other players globally.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-4 text-center rounded-2xl p-6 shadow-md border border-border/50 bg-card/50"
            >
              <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
