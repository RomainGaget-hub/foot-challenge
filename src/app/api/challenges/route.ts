import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/utils';

export async function GET() {
  return handleApiError(async () => {
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
        difficulty: true,
        backgroundImage: true,
        questions: {
          select: {
            id: true,
            points: true,
          },
        },
      },
    });

    // Calculate total points for each challenge
    const challengesWithTotalPoints = challenges.map((challenge) => {
      const totalPoints = challenge.questions.reduce(
        (sum: number, question: { points: number }) =>
          sum + question.points,
        0
      );

      return {
        ...challenge,
        totalPoints,
        totalQuestions: challenge.questions.length,
      };
    });

    return NextResponse.json(challengesWithTotalPoints);
  }, 'Failed to fetch challenges');
}
