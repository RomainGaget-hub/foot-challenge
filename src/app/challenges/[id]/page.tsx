'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/store/useGameStore';
import { motion } from 'framer-motion';

export default function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    getCurrentChallenge,
    getCurrentQuestion,
    submitAnswer,
    getRemainingAttempts,
    correctAnswers,
    nextQuestion,
    setChallengeCompleted,
    resetGame,
  } = useGameStore();

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30); // 30 seconds per question
  const [totalScore, setTotalScore] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [animation, setAnimation] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const challenge = getCurrentChallenge();
  const currentQuestion = getCurrentQuestion();

  useEffect(() => {
    if (!challenge) {
      router.push('/challenges');
      return;
    }

    // Make sure we start the challenge properly
    useGameStore.getState().startChallenge(id);
  }, [challenge, id, router]);

  // Reset game state when navigating away
  useEffect(() => {
    return () => {
      resetGame();
    };
  }, [resetGame]);

  useEffect(() => {
    // Start timer for each question
    setRemainingTime(30);
    // Reset hint state for each question
    setHintUsed(false);
    setShowHint(false);
    setErrorMessage('');

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion]);

  useEffect(() => {
    if (remainingTime === 0 && !isSubmitting && !isGameCompleted) {
      handleTimeUp();
    }
  }, [remainingTime, isSubmitting, isGameCompleted]);

  if (!challenge || !currentQuestion) {
    return null;
  }

  const questionNumber =
    challenge.questions.findIndex((q) => q.id === currentQuestion.id) + 1;
  const totalQuestions = challenge.questions.length;
  const remainingAttempts = getRemainingAttempts(id, currentQuestion.id);
  const isQuestionAnswered = correctAnswers.includes(currentQuestion.id);

  const handleTimeUp = () => {
    if (isSubmitting || isGameCompleted) return;

    setFeedback('incorrect');
    setAnimation('shake');
    setErrorMessage(
      `Time's up! The correct answer was: ${currentQuestion.correctAnswer}`
    );

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  // Helper function to normalize text for comparison
  const normalizeText = (text: string) => {
    return (
      text
        .toLowerCase()
        // Remove accents and diacritics
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Remove special characters
        .replace(/[^\w\s]/g, '')
        .trim()
    );
  };

  const isAnswerCorrect = (userAnswer: string, correctAnswer: string) => {
    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);

    // Check if the answer is the full name or just the surname
    const correctAnswerParts = normalizedCorrectAnswer.split(' ');
    const surname = correctAnswerParts[correctAnswerParts.length - 1];

    return (
      normalizedUserAnswer === normalizedCorrectAnswer ||
      normalizedUserAnswer === surname
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      isSubmitting ||
      !answer.trim() ||
      remainingAttempts === 0 ||
      isQuestionAnswered
    )
      return;

    setIsSubmitting(true);

    // Check if the answer is correct using our looser matching function
    const isCorrect = isAnswerCorrect(
      answer.trim(),
      currentQuestion.correctAnswer
    );

    // Record the answer in the game store
    submitAnswer(
      isCorrect ? currentQuestion.correctAnswer : answer.trim()
    );

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      // Calculate score based on remaining time and question points
      const timeBonus = Math.floor((remainingTime / 30) * 10); // Max 10 points for time
      const questionScore = currentQuestion.points + timeBonus;
      setTotalScore((prev) => prev + questionScore);
      setAnimation('pulse');
      setErrorMessage(`Correct! ${currentQuestion.correctAnswer}`);
    } else {
      setAnimation('shake');
      setErrorMessage('Incorrect! Try again.');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (isCorrect) {
        moveToNextQuestion();
      } else {
        setAnswer('');
        setAnimation('');
      }
    }, 1500);
  };

  const handleSkipQuestion = () => {
    if (isSubmitting || isGameCompleted) return;

    setErrorMessage(
      `Skipped. The correct answer was: ${currentQuestion.correctAnswer}`
    );
    setFeedback('incorrect');

    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleShowHint = () => {
    if (!hintUsed) {
      setHintUsed(true);
      setShowHint(true);
    }
  };

  const moveToNextQuestion = () => {
    setAnswer('');
    setFeedback(null);
    setAnimation('');
    setErrorMessage('');
    setShowHint(false);

    const hasNextQuestion = nextQuestion();

    if (!hasNextQuestion) {
      // End of challenge
      setChallengeCompleted(id, totalScore);
      setIsGameCompleted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const renderQuestionContent = () => {
    if (challenge.type === 'Club Journeyman') {
      return (
        <>
          <h3 className="text-lg font-medium">
            Guess the player who played for:
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentQuestion.teams?.map((team) => (
              <div
                key={team}
                className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium"
              >
                {team}
              </div>
            ))}
          </div>
        </>
      );
    } else if (challenge.type === 'National Team Star') {
      return (
        <>
          <h3 className="text-lg font-medium">
            Guess the player who plays for {currentQuestion.club} and is
            from {currentQuestion.nationality}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium">
              Club: {currentQuestion.club}
            </div>
            <div className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium">
              Nationality: {currentQuestion.nationality}
            </div>
          </div>
        </>
      );
    } else if (challenge.type === 'Two-Club Legend') {
      return (
        <>
          <h3 className="text-lg font-medium">
            Guess the player who played for both:
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentQuestion.teams?.map((team) => (
              <div
                key={team}
                className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium"
              >
                {team}
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  if (isGameCompleted) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-2xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Challenge Completed!
              </CardTitle>
              <CardDescription className="text-center text-lg">
                {challenge.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6">
                <div className="text-5xl font-bold mb-2">{totalScore}</div>
                <p className="text-muted-foreground">Total Points</p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2">Challenge Summary</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Questions Answered:</span>
                    <span>{totalQuestions}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span>
                      {
                        correctAnswers.filter((id) =>
                          challenge.questions.some((q) => q.id === id)
                        ).length
                      }
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => {
                    // Reset game state completely first
                    resetGame();

                    // Reset local state
                    setTotalScore(0);
                    setIsGameCompleted(false);
                    setErrorMessage('');
                    setAnswer('');
                    setFeedback(null);
                    setAnimation('');
                    setHintUsed(false);
                    setShowHint(false);

                    // Start the challenge again (after a small delay to ensure state has been reset)
                    setTimeout(() => {
                      useGameStore.getState().startChallenge(id);
                    }, 50);
                  }}
                >
                  Play Again
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/challenges')}
                >
                  Return to Challenges
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{challenge.name}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Question {questionNumber} of {totalQuestions}
                </span>
                <span>{remainingTime} seconds</span>
              </div>
              <Progress
                value={(questionNumber / totalQuestions) * 100}
                className="h-2"
              />
            </div>

            {/* Question */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`space-y-4 p-4 rounded-lg ${
                feedback === 'correct'
                  ? 'bg-green-50 border border-green-200'
                  : feedback === 'incorrect'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {renderQuestionContent()}

              {/* Hint */}
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm"
                >
                  <span className="font-medium">Hint:</span>{' '}
                  {currentQuestion.hint}
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-2 text-sm font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {/* Answer Input */}
              <form onSubmit={handleSubmit} className="pt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="answer">Your Answer</Label>
                    <motion.div
                      animate={
                        animation === 'shake'
                          ? {
                              x: [0, -10, 10, -10, 10, 0],
                              transition: { duration: 0.5 },
                            }
                          : animation === 'pulse'
                          ? {
                              scale: [1, 1.05, 1],
                              transition: { duration: 0.5 },
                            }
                          : {}
                      }
                      onAnimationComplete={() => setAnimation('')}
                    >
                      <Input
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={
                          feedback === 'correct'
                            ? 'border-green-500'
                            : feedback === 'incorrect'
                            ? 'border-red-500'
                            : ''
                        }
                        disabled={
                          isSubmitting ||
                          remainingAttempts === 0 ||
                          isQuestionAnswered ||
                          remainingTime === 0
                        }
                      />
                    </motion.div>
                  </div>

                  <div className="flex flex-col sm:flex-row w-full gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={
                        isSubmitting ||
                        !answer.trim() ||
                        remainingAttempts === 0 ||
                        isQuestionAnswered ||
                        remainingTime === 0
                      }
                    >
                      Submit
                    </Button>

                    <div className="flex gap-2">
                      {/* Skip Question Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSkipQuestion}
                        disabled={
                          isSubmitting ||
                          isQuestionAnswered ||
                          remainingTime === 0
                        }
                      >
                        Skip
                      </Button>

                      {/* Hint Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleShowHint}
                        disabled={
                          hintUsed ||
                          isSubmitting ||
                          isQuestionAnswered ||
                          remainingTime === 0
                        }
                      >
                        Hint
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
