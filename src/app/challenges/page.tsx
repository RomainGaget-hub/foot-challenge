'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/useGameStore';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChallengesPage() {
  const router = useRouter();
  const {
    startChallenge,
    getChallengeScore,
    fetchChallenges,
    challenges,
    loading,
    error,
  } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>(
    'all'
  );

  useEffect(() => {
    // Fetch challenges when the component mounts
    fetchChallenges();
  }, [fetchChallenges]);

  // Return early if still loading
  if (loading) {
    return (
      <MainLayout>
        <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">
                Footy Genius Challenges
              </h1>
              <div className="flex space-x-2 justify-center">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="w-full h-64" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error || !challenges) {
    return (
      <MainLayout>
        <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-8 items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-500 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "Couldn't load challenges"}
              </p>
              <Button onClick={() => fetchChallenges()}>Try Again</Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === 'all') return true;
    const isCompleted = getChallengeScore(challenge.id) > 0;
    return filter === 'completed' ? isCompleted : !isCompleted;
  });

  const handleStartChallenge = (challengeId: string) => {
    startChallenge(challengeId);
    router.push(`/challenges/${challengeId}`);
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      case 4:
        return 'Expert';
      case 5:
        return 'Legend';
      default:
        return 'Unknown';
    }
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Footy Genius Challenges</h1>
            <div className="flex space-x-2 justify-center">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'incomplete' ? 'default' : 'outline'}
                onClick={() => setFilter('incomplete')}
              >
                Incomplete
              </Button>
            </div>
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No challenges found</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
              {filteredChallenges.map((challenge) => {
                const isCompleted = getChallengeScore(challenge.id) > 0;
                const score = getChallengeScore(challenge.id);
                const backgroundImage =
                  challenge.backgroundImage ||
                  'https://source.unsplash.com/random/900×700/?football,stadium';

                return (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <Card
                      className="overflow-hidden w-full h-full flex flex-col relative group cursor-pointer border-2"
                      style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300"></div>

                      <div className="relative z-10 flex flex-col h-full text-white">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl md:text-2xl">
                              {challenge.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="bg-primary/20 text-white border-primary/30"
                            >
                              {getDifficultyLabel(challenge.difficulty)}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-300">
                            {isCompleted
                              ? `Completed - Score: ${score}`
                              : `${
                                  challenge.questions?.length || 5
                                } questions to answer`}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-3">
                            <p className="font-medium text-white/90">
                              {challenge.description}
                            </p>

                            <div className="pt-2">
                              <p className="text-sm text-white/70">
                                {challenge.type === 'Club Journeyman' &&
                                  'Guess players based on their career clubs'}
                                {challenge.type === 'National Team Star' &&
                                  'Match players with their clubs and nationalities'}
                                {challenge.type === 'Two-Club Legend' &&
                                  'Find players who played for both specified clubs'}
                              </p>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="mt-auto pt-2">
                          <Button
                            className="w-full bg-primary/90 hover:bg-primary transition-colors"
                            onClick={() =>
                              handleStartChallenge(challenge.id)
                            }
                          >
                            {isCompleted
                              ? 'Play Again'
                              : 'Start Challenge'}
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
