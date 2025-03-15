-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "challengesCompleted" INTEGER NOT NULL DEFAULT 0,
    "battlesWon" INTEGER NOT NULL DEFAULT 0,
    "battlesLost" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "points" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChallengeAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "attemptsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChallengeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChallengeAttempt_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "winnerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Battle_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battle_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattleRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "battleId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "teamsJson" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "player1Guess" TEXT,
    "player2Guess" TEXT,
    "player1Correct" BOOLEAN NOT NULL DEFAULT false,
    "player2Correct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BattleRound_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeAttempt_userId_challengeId_key" ON "ChallengeAttempt"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleRound_battleId_roundNumber_key" ON "BattleRound"("battleId", "roundNumber");
