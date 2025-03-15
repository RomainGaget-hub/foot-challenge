import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/utils';
import { parseJsonField } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return handleApiError(async () => {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id,
      },
      include: {
        questions: true,
      },
    });

    if (!challenge) {
      return new Response(
        JSON.stringify({ error: 'Challenge not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Process any JSON fields in the questions
    const processedChallenge = {
      ...challenge,
      questions: challenge.questions.map((question) => ({
        ...question,
        teams: parseJsonField<string[]>(question.teams),
      })),
    };

    return NextResponse.json(processedChallenge);
  }, 'Failed to fetch challenge');
}
