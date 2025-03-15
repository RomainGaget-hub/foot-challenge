'use client';

import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { mockBattles, mockUsers } from '@/data/mock-data';
import { useGameStore } from '@/store/useGameStore';
import { mockChallenges } from '@/data/mock-data';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { correctAnswers } = useGameStore();

  // In a real app, we would fetch the user's data from the API
  // For now, we'll just use the first mock user
  const user = mockUsers[0];

  // Get completed challenges
  const completedChallenges = mockChallenges.filter((challenge) =>
    correctAnswers.includes(challenge.id)
  );

  // Get user's battles
  const userBattles = mockBattles.filter(
    (battle) =>
      battle.player1Id === user.id || battle.player2Id === user.id
  );

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex flex-col space-y-6">
          <Card className="w-full mx-auto">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      session?.user?.image ||
                      `https://avatar.vercel.sh/${user.username}`
                    }
                    alt={session?.user?.name || user.username}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) ||
                      user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {session?.user?.name || user.username}
                  </CardTitle>
                  <CardDescription>
                    {session?.user?.email || user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">{user.points}</span>
                  <span className="text-sm text-muted-foreground">
                    Points
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">
                    {user.challengesCompleted}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Challenges
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">
                    {user.battlesWon}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Battles Won
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="challenges">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="battles">Battles</TabsTrigger>
            </TabsList>
            <TabsContent value="challenges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Challenges</CardTitle>
                  <CardDescription>
                    You have completed {completedChallenges.length}{' '}
                    challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {completedChallenges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        You haven&apos;t completed any challenges yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedChallenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              Challenge #{challenge.id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.teams.join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {challenge.points} points
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.correctAnswer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="battles" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Battle History</CardTitle>
                  <CardDescription>
                    You have participated in {userBattles.length} battles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userBattles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        You haven&apos;t participated in any battles yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBattles.map((battle) => {
                        const isPlayer1 = battle.player1Id === user.id;
                        const opponent = mockUsers.find(
                          (u) =>
                            u.id ===
                            (isPlayer1
                              ? battle.player2Id
                              : battle.player1Id)
                        );
                        const userScore = isPlayer1
                          ? battle.player1Score
                          : battle.player2Score;
                        const opponentScore = isPlayer1
                          ? battle.player2Score
                          : battle.player1Score;
                        const isWinner = battle.winnerId === user.id;
                        const isDraw =
                          battle.status === 'COMPLETED' &&
                          !battle.winnerId;

                        return (
                          <div
                            key={battle.id}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                Battle #{battle.id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                vs {opponent?.username || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {userScore} - {opponentScore}
                              </p>
                              <p
                                className={`text-sm ${
                                  isWinner
                                    ? 'text-green-500'
                                    : isDraw
                                    ? 'text-yellow-500'
                                    : battle.status === 'COMPLETED'
                                    ? 'text-red-500'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {battle.status === 'COMPLETED'
                                  ? isWinner
                                    ? 'Won'
                                    : isDraw
                                    ? 'Draw'
                                    : 'Lost'
                                  : battle.status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
