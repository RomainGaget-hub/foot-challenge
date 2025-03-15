import { PrismaClient } from '@prisma/client';
import { mockChallenges, mockUsers } from '../src/data/mock-data';

const prisma = new PrismaClient();

// Define types for different question formats
interface BaseQuestion {
  id: string;
  correctAnswer: string;
  points: number;
  hint?: string;
}

interface TeamQuestion extends BaseQuestion {
  teams: string[];
  club?: undefined;
  nationality?: undefined;
}

interface NationalityQuestion extends BaseQuestion {
  teams?: undefined;
  club: string;
  nationality: string;
}

type Question = TeamQuestion | NationalityQuestion;

// Type guard function to check if a question has teams
function hasTeams(question: Question): question is TeamQuestion {
  return Array.isArray((question as TeamQuestion).teams);
}

// Type guard function to check if a question has nationality and club
function hasNationalityAndClub(
  question: Question
): question is NationalityQuestion {
  return (
    typeof (question as NationalityQuestion).nationality === 'string' &&
    typeof (question as NationalityQuestion).club === 'string'
  );
}

async function main() {
  console.log('Starting seed process...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.battleRound.deleteMany({});
  await prisma.battle.deleteMany({});
  await prisma.challengeAttempt.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating users...');
  for (const user of mockUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: 'hashed_password', // In a real app, this should be properly hashed
        points: user.points,
        challengesCompleted: user.challengesCompleted,
        battlesWon: user.battlesWon,
        battlesLost: user.battlesLost,
      },
    });
  }

  console.log('Creating challenges with questions...');
  for (const challenge of mockChallenges) {
    const createdChallenge = await prisma.challenge.create({
      data: {
        id: challenge.id,
        type: challenge.type,
        name: challenge.name,
        description: challenge.description,
        difficulty: challenge.difficulty,
        backgroundImage: challenge.backgroundImage,
      },
    });

    console.log(`Created challenge: ${challenge.name}`);

    // Create associated questions
    for (const question of challenge.questions as Question[]) {
      if (hasTeams(question)) {
        await prisma.question.create({
          data: {
            id: question.id,
            correctAnswer: question.correctAnswer,
            points: question.points,
            hint: question.hint,
            teams: JSON.stringify(question.teams),
            challengeId: createdChallenge.id,
          },
        });
      } else if (hasNationalityAndClub(question)) {
        await prisma.question.create({
          data: {
            id: question.id,
            correctAnswer: question.correctAnswer,
            points: question.points,
            hint: question.hint,
            club: question.club,
            nationality: question.nationality,
            challengeId: createdChallenge.id,
          },
        });
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
