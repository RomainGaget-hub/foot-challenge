'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/main-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { mockUsers } from '@/data/mock-data';

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<
    'points' | 'challenges' | 'battles'
  >('points');

  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (sortBy === 'points') {
      return b.points - a.points;
    } else if (sortBy === 'challenges') {
      return b.challengesCompleted - a.challengesCompleted;
    } else {
      return b.battlesWon - a.battlesWon;
    }
  });

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <div className="flex space-x-2 justify-center">
              <Button
                variant={sortBy === 'points' ? 'default' : 'outline'}
                onClick={() => setSortBy('points')}
              >
                Points
              </Button>
              <Button
                variant={sortBy === 'challenges' ? 'default' : 'outline'}
                onClick={() => setSortBy('challenges')}
              >
                Challenges
              </Button>
              <Button
                variant={sortBy === 'battles' ? 'default' : 'outline'}
                onClick={() => setSortBy('battles')}
              >
                Battles
              </Button>
            </div>
          </div>

          <Card className="mx-auto w-full">
            <CardHeader className="pb-2">
              <CardTitle>Top Players</CardTitle>
              <CardDescription>
                {sortBy === 'points'
                  ? 'Ranked by total points earned'
                  : sortBy === 'challenges'
                  ? 'Ranked by challenges completed'
                  : 'Ranked by battles won'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${user.username}`}
                        />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.challengesCompleted} challenges •{' '}
                          {user.battlesWon} wins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{user.points}</p>
                        <p className="text-xs text-muted-foreground">
                          POINTS
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
