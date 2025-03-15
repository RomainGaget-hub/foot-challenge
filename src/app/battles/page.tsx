'use client';

import { useState } from 'react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { mockBattles, mockUsers } from '@/data/mock-data';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BattlesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // In a real app, we would filter battles based on the current user
  // For now, we'll just show all battles from mock data
  const activeBattles = mockBattles.filter(
    (battle) => battle.status !== 'COMPLETED'
  );
  const completedBattles = mockBattles.filter(
    (battle) => battle.status === 'COMPLETED'
  );

  const getUsernameById = (userId: string) => {
    const user = mockUsers.find((user) => user.id === userId);
    return user ? user.username : 'Unknown';
  };

  const handleCreateBattle = () => {
    // In a real app, we would create a battle with the specified user
    // For now, we'll just close the dialog
    setIsDialogOpen(false);
    setUsername('');
  };

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Battles</h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">Challenge a Friend</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Challenge a Player</DialogTitle>
                  <DialogDescription>
                    Enter the username of the player you want to challenge.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBattle}>Challenge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Battles</TabsTrigger>
              <TabsTrigger value="completed">
                Completed Battles
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              {activeBattles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No active battles found.
                  </p>
                  <p className="text-muted-foreground">
                    Challenge a player to start a battle!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {activeBattles.map((battle) => (
                    <Card key={battle.id}>
                      <CardHeader>
                        <CardTitle>Battle #{battle.id}</CardTitle>
                        <CardDescription>
                          {battle.status === 'PENDING'
                            ? 'Waiting to start'
                            : 'In progress'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="font-medium">
                              {getUsernameById(battle.player1Id)}
                            </p>
                            <p className="text-3xl font-bold">
                              {battle.player1Score}
                            </p>
                          </div>
                          <div className="text-xl font-bold">VS</div>
                          <div className="text-center">
                            <p className="font-medium">
                              {getUsernameById(battle.player2Id)}
                            </p>
                            <p className="text-3xl font-bold">
                              {battle.player2Score}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() =>
                            router.push(`/battles/${battle.id}`)
                          }
                        >
                          {battle.status === 'PENDING'
                            ? 'Start Battle'
                            : 'Continue Battle'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              {completedBattles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No completed battles found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {completedBattles.map((battle) => (
                    <Card key={battle.id}>
                      <CardHeader>
                        <CardTitle>Battle #{battle.id}</CardTitle>
                        <CardDescription>
                          {battle.winnerId
                            ? `Winner: ${getUsernameById(battle.winnerId)}`
                            : 'Draw'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="font-medium">
                              {getUsernameById(battle.player1Id)}
                            </p>
                            <p className="text-3xl font-bold">
                              {battle.player1Score}
                            </p>
                          </div>
                          <div className="text-xl font-bold">VS</div>
                          <div className="text-center">
                            <p className="font-medium">
                              {getUsernameById(battle.player2Id)}
                            </p>
                            <p className="text-3xl font-bold">
                              {battle.player2Score}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            router.push(`/battles/${battle.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
