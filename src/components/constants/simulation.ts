export interface SimulationEvent {
  id: string;
  type: 'tournament' | 'friend' | 'ranking' | 'news' | 'challenge';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  interactive?: boolean;
  choices?: string[];
}

export const SIMULATION_EVENTS: SimulationEvent[] = [
  {
    id: '1',
    type: 'friend',
    title: 'Kyle Trent advances to Semi-Finals',
    description: 'Your friend Kyle Trent has defeated veteran Marcus Stone 3-2 in an intense quarter-final match. "The training with you really paid off!" he says.',
    timestamp: new Date(2024, 7, 16, 14, 30),
    priority: 'medium'
  },
  {
    id: '2',
    type: 'tournament',
    title: 'Regional Cup Registration Closes',
    description: 'Registration for the Eastern Regional Cup has closed with 64 participants. The tournament bracket has been finalized.',
    timestamp: new Date(2024, 7, 16, 18, 0),
    priority: 'high'
  },
  {
    id: '3',
    type: 'challenge',
    title: 'Brett Stunner challenges you!',
    description: 'Rising star Brett Stunner has issued a formal challenge. "I heard you\'re pretty good. Let\'s see what you\'ve got!"',
    timestamp: new Date(2024, 7, 17, 10, 0),
    priority: 'high',
    interactive: true,
    choices: ['Accept Challenge', 'Decline', 'Suggest Different Time']
  },
  {
    id: '4',
    type: 'ranking',
    title: 'Ranking Update',
    description: 'You have moved up 2 positions in the regional rankings following your recent victories. Current rank: #45',
    timestamp: new Date(2024, 7, 17, 16, 0),
    priority: 'medium'
  },
  {
    id: '5',
    type: 'news',
    title: 'Legendary Sighting Investigation',
    description: 'The Mythoras Research Institute has confirmed the Shadow Woods sighting. A joint expedition is being organized for next week.',
    timestamp: new Date(2024, 7, 18, 9, 0),
    priority: 'low'
  },
  {
    id: '6',
    type: 'tournament',
    title: 'Premier Shield Tournament Begins',
    description: 'The most prestigious tournament of the season begins today. 128 elite technicians compete for the ultimate prize.',
    timestamp: new Date(2024, 7, 18, 12, 0),
    priority: 'high'
  }
];

export const EVENT_ICONS = {
  tournament: 'Trophy',
  friend: 'Users',
  ranking: 'TrendingUp',
  news: 'MessageSquare',
  challenge: 'Award'
} as const;

export const PRIORITY_COLORS = {
  high: 'text-red-400 border-red-400',
  medium: 'text-yellow-400 border-yellow-400',
  low: 'text-gray-400 border-gray-400'
} as const;