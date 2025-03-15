const mockChallenges = [
  {
    id: '1',
    type: 'Club Journeyman',
    name: 'Club Journeyman',
    description: 'Guess the player who has played for these teams.',
    questions: [
      {
        id: '1-1',
        teams: ['Chelsea', 'Real Madrid', 'Manchester United'],
        correctAnswer: 'Eden Hazard',
        points: 10,
        hint: 'Belgian winger who won multiple Premier League titles.',
      },
      {
        id: '1-2',
        teams: ['Barcelona', 'Inter Milan', 'Chelsea'],
        correctAnswer: "Samuel Eto'o",
        points: 15,
        hint: 'Cameroonian striker who won Champions League with Barcelona and Inter.',
      },
      {
        id: '1-3',
        teams: ['Liverpool', 'Barcelona', 'Bayern Munich'],
        correctAnswer: 'Philippe Coutinho',
        points: 10,
        hint: 'Brazilian attacking midfielder known for his long-range shots.',
      },
      {
        id: '1-4',
        teams: ['Arsenal', 'Barcelona', 'New York Red Bulls'],
        correctAnswer: 'Thierry Henry',
        points: 10,
        hint: "French forward who is Arsenal's all-time leading goalscorer.",
      },
      {
        id: '1-5',
        teams: [
          'Ajax',
          'Juventus',
          'Inter Milan',
          'Barcelona',
          'AC Milan',
        ],
        correctAnswer: 'Zlatan Ibrahimovic',
        points: 10,
        hint: 'Swedish striker known for his acrobatic goals and unique personality.',
      },
    ],
    difficulty: 2,
    backgroundImage:
      'https://source.unsplash.com/random/900×700/?football,stadium',
  },
  {
    id: '2',
    type: 'National Team Star',
    name: 'National Team Star',
    description:
      'Guess the player who played for this club and has this nationality.',
    questions: [
      {
        id: '2-1',
        club: 'Paris Saint-Germain',
        nationality: 'France',
        correctAnswer: 'Kylian Mbappé',
        points: 10,
        hint: 'World Cup winner who is known for his incredible speed.',
      },
      {
        id: '2-2',
        club: 'Bayern Munich',
        nationality: 'Poland',
        correctAnswer: 'Robert Lewandowski',
        points: 10,
        hint: "Prolific goalscorer who broke Gerd Müller's Bundesliga record.",
      },
      {
        id: '2-3',
        club: 'Liverpool',
        nationality: 'Egypt',
        correctAnswer: 'Mohamed Salah',
        points: 15,
        hint: 'Known as "The Egyptian King" by Liverpool fans.',
      },
      {
        id: '2-4',
        club: 'Manchester City',
        nationality: 'Belgium',
        correctAnswer: 'Kevin De Bruyne',
        points: 10,
        hint: 'Midfielder who is considered one of the best passers in the world.',
      },
      {
        id: '2-5',
        club: 'Tottenham Hotspur',
        nationality: 'South Korea',
        correctAnswer: 'Son Heung-min',
        points: 15,
        hint: 'Winger who won the Premier League Golden Boot in 2021-22.',
      },
    ],
    difficulty: 3,
    backgroundImage:
      'https://source.unsplash.com/random/900×700/?football,players',
  },
  {
    id: '3',
    type: 'Two-Club Legend',
    name: 'Two-Club Legend',
    description: 'Guess the player who played for both clubs.',
    questions: [
      {
        id: '3-1',
        teams: ['Juventus', 'Real Madrid'],
        correctAnswer: 'Cristiano Ronaldo',
        points: 10,
        hint: "Portuguese forward who has won multiple Ballon d'Or awards.",
      },
      {
        id: '3-2',
        teams: ['Liverpool', 'Barcelona'],
        correctAnswer: 'Luis Suárez',
        points: 15,
        hint: 'Uruguayan striker known for his clinical finishing ability.',
      },
      {
        id: '3-3',
        teams: ['Manchester United', 'LA Galaxy'],
        correctAnswer: 'David Beckham',
        points: 10,
        hint: 'English midfielder who became an international fashion icon.',
      },
      {
        id: '3-4',
        teams: ['Arsenal', 'Barcelona'],
        correctAnswer: 'Thierry Henry',
        points: 15,
        hint: 'French striker who returned to Arsenal on loan from New York Red Bulls.',
      },
      {
        id: '3-5',
        teams: ['Chelsea', 'Arsenal'],
        correctAnswer: 'Olivier Giroud',
        points: 10,
        hint: 'French striker who won the World Cup in 2018.',
      },
    ],
    difficulty: 2,
    backgroundImage:
      'https://source.unsplash.com/random/900×700/?football,pitch',
  },
];

const mockUsers = [
  {
    id: '1',
    username: 'footie_fan',
    email: 'footie_fan@example.com',
    points: 120,
    challengesCompleted: 15,
    battlesWon: 3,
    battlesLost: 1,
  },
  {
    id: '2',
    username: 'soccer_master',
    email: 'soccer_master@example.com',
    points: 180,
    challengesCompleted: 22,
    battlesWon: 5,
    battlesLost: 2,
  },
  {
    id: '3',
    username: 'goal_hunter',
    email: 'goal_hunter@example.com',
    points: 95,
    challengesCompleted: 12,
    battlesWon: 2,
    battlesLost: 3,
  },
  {
    id: '4',
    username: 'top_striker',
    email: 'top_striker@example.com',
    points: 210,
    challengesCompleted: 25,
    battlesWon: 7,
    battlesLost: 1,
  },
];

const mockBattles = [
  {
    id: '1',
    player1Id: '1',
    player2Id: '2',
    player1Score: 3,
    player2Score: 5,
    status: 'COMPLETED',
    winnerId: '2',
  },
  {
    id: '2',
    player1Id: '3',
    player2Id: '4',
    player1Score: 2,
    player2Score: 7,
    status: 'COMPLETED',
    winnerId: '4',
  },
  {
    id: '3',
    player1Id: '1',
    player2Id: '3',
    player1Score: 4,
    player2Score: 2,
    status: 'COMPLETED',
    winnerId: '1',
  },
  {
    id: '4',
    player1Id: '2',
    player2Id: '4',
    player1Score: 6,
    player2Score: 6,
    status: 'COMPLETED',
    winnerId: null, // tie
  },
];

module.exports = {
  mockChallenges,
  mockUsers,
  mockBattles,
};
