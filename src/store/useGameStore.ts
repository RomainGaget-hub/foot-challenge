import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  correctAnswer: string;
  points: number;
  teams?: string[];
  club?: string;
  nationality?: string;
  hint: string;
}

export interface Challenge {
  id: string;
  type: string;
  name: string;
  description: string;
  questions: Question[];
  difficulty: number;
  backgroundImage: string;
}

interface GameState {
  currentChallengeId: string | null;
  currentQuestionIndex: number;
  challengeAttempts: Record<string, Record<string, number>>;
  correctAnswers: string[];
  currentBattleId: string | null;
  challengeScores: Record<string, number>;
  challenges: Challenge[] | null;
  loading: boolean;
  error: string | null;

  // Actions
  startChallenge: (challengeId: string) => void;
  submitAnswer: (answer: string) => boolean;
  resetGame: () => void;
  startBattle: (battleId: string) => void;
  endBattle: () => void;
  fetchChallenges: () => Promise<void>;
  fetchChallenge: (challengeId: string) => Promise<Challenge | null>;
  getCurrentChallenge: () => Challenge | null;
  getCurrentQuestion: () => Question | null;
  getRemainingAttempts: (
    challengeId: string,
    questionId: string
  ) => number;
  nextQuestion: () => boolean;
  getChallengeScore: (challengeId: string) => number;
  setChallengeCompleted: (challengeId: string, score: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChallengeId: null,
      currentQuestionIndex: 0,
      challengeAttempts: {},
      correctAnswers: [],
      currentBattleId: null,
      challengeScores: {},
      challenges: null,
      loading: false,
      error: null,

      fetchChallenges: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/challenges');
          if (!response.ok) {
            throw new Error('Failed to fetch challenges');
          }
          const data = await response.json();
          set({ challenges: data, loading: false });
        } catch (error) {
          console.error('Error fetching challenges:', error);
          set({
            error:
              error instanceof Error ? error.message : 'Unknown error',
            loading: false,
          });
        }
      },

      fetchChallenge: async (challengeId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/challenges/${challengeId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch challenge');
          }
          const data = await response.json();

          // Update the challenges in the store if they exist
          set((state) => {
            const existingChallenges = state.challenges || [];
            const challengeIndex = existingChallenges.findIndex(
              (c) => c.id === challengeId
            );

            if (challengeIndex >= 0) {
              // Replace the existing challenge
              const updatedChallenges = [...existingChallenges];
              updatedChallenges[challengeIndex] = data;
              return { challenges: updatedChallenges, loading: false };
            } else {
              // Add the new challenge
              return {
                challenges: [...existingChallenges, data],
                loading: false,
              };
            }
          });

          return data;
        } catch (error) {
          console.error('Error fetching challenge:', error);
          set({
            error:
              error instanceof Error ? error.message : 'Unknown error',
            loading: false,
          });
          return null;
        }
      },

      startChallenge: (challengeId) => {
        // Load the challenge data if not already loaded
        const currentChallenge = get().getCurrentChallenge();
        if (!currentChallenge || currentChallenge.id !== challengeId) {
          get().fetchChallenge(challengeId);
        }

        // Clear previous answers for this challenge
        set((state) => {
          const filteredAnswers = state.correctAnswers.filter(
            (id) => !id.startsWith(`${challengeId}-`)
          );

          return {
            currentChallengeId: challengeId,
            currentQuestionIndex: 0,
            correctAnswers: filteredAnswers,
          };
        });

        // Initialize attempts counter if not already present
        if (!get().challengeAttempts[challengeId]) {
          set((state) => ({
            challengeAttempts: {
              ...state.challengeAttempts,
              [challengeId]: {},
            },
          }));
        } else {
          // Reset attempts for this challenge
          set((state) => ({
            challengeAttempts: {
              ...state.challengeAttempts,
              [challengeId]: {},
            },
          }));
        }
      },

      submitAnswer: (answer) => {
        const currentQuestion = get().getCurrentQuestion();
        const currentChallenge = get().getCurrentChallenge();

        if (!currentQuestion || !currentChallenge) return false;

        const challengeId = currentChallenge.id;
        const questionId = currentQuestion.id;

        // Increment attempts counter for this specific question
        set((state) => ({
          challengeAttempts: {
            ...state.challengeAttempts,
            [challengeId]: {
              ...state.challengeAttempts[challengeId],
              [questionId]:
                (state.challengeAttempts[challengeId]?.[questionId] || 0) +
                1,
            },
          },
        }));

        const isCorrect =
          answer.toLowerCase() ===
          currentQuestion.correctAnswer.toLowerCase();

        if (isCorrect) {
          set((state) => ({
            correctAnswers: [...state.correctAnswers, questionId],
          }));
        }

        return isCorrect;
      },

      resetGame: () => {
        const currentChallengeId = get().currentChallengeId;

        // Reset basic game state
        set((state) => {
          // Filter out correct answers that belong to the current challenge
          const filteredAnswers = currentChallengeId
            ? state.correctAnswers.filter((answerId) => {
                // Check if this answer belongs to the current challenge
                // Challenge question IDs are formatted as 'challengeId-questionNumber'
                return !answerId.startsWith(`${currentChallengeId}-`);
              })
            : state.correctAnswers;

          return {
            currentChallengeId: null,
            currentQuestionIndex: 0,
            correctAnswers: filteredAnswers,
          };
        });

        // If we have a current challenge, clear its attempts
        if (currentChallengeId) {
          set((state) => ({
            challengeAttempts: {
              ...state.challengeAttempts,
              [currentChallengeId]: {},
            },
          }));
        }
      },

      startBattle: (battleId) => {
        set({ currentBattleId: battleId });
      },

      endBattle: () => {
        set({ currentBattleId: null });
      },

      getCurrentChallenge: () => {
        const { currentChallengeId, challenges } = get();
        if (!currentChallengeId || !challenges) return null;

        return (
          challenges.find(
            (challenge) => challenge.id === currentChallengeId
          ) || null
        );
      },

      getCurrentQuestion: () => {
        const currentChallenge = get().getCurrentChallenge();
        const { currentQuestionIndex } = get();

        if (
          !currentChallenge ||
          currentQuestionIndex >= currentChallenge.questions.length
        ) {
          return null;
        }

        return currentChallenge.questions[currentQuestionIndex];
      },

      getRemainingAttempts: (challengeId, questionId) => {
        const maxAttempts = 3;
        const currentAttempts =
          get().challengeAttempts[challengeId]?.[questionId] || 0;
        return Math.max(0, maxAttempts - currentAttempts);
      },

      nextQuestion: () => {
        const { currentQuestionIndex } = get();
        const currentChallenge = get().getCurrentChallenge();

        if (!currentChallenge) return false;

        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= currentChallenge.questions.length) {
          return false; // No more questions
        }

        set({ currentQuestionIndex: nextIndex });
        return true; // Successfully moved to next question
      },

      getChallengeScore: (challengeId) => {
        return get().challengeScores[challengeId] || 0;
      },

      setChallengeCompleted: (challengeId, score) => {
        // Store the score but keep the current score if it's higher
        set((state) => {
          const currentScore = state.challengeScores[challengeId] || 0;
          const newScore = Math.max(currentScore, score);

          return {
            challengeScores: {
              ...state.challengeScores,
              [challengeId]: newScore,
            },
          };
        });
      },
    }),
    {
      name: 'football-game-storage',
    }
  )
);
