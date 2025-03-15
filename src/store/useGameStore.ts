import { create } from 'zustand';
import { mockChallenges } from '@/data/mock-data';
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

  // Actions
  startChallenge: (challengeId: string) => void;
  submitAnswer: (answer: string) => boolean;
  resetGame: () => void;
  startBattle: (battleId: string) => void;
  endBattle: () => void;
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

      startChallenge: (challengeId) => {
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
        const { currentChallengeId } = get();
        if (!currentChallengeId) return null;

        return (
          mockChallenges.find(
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
