export interface Affirmation {
  id: string;
  emoji: string;
  text: string;
  subtext: string;
  author: string;
}

export const affirmations: Affirmation[] = [
  {
    id: '1',
    emoji: '🌱',
    text: 'You are doing better than you think.',
    subtext: 'Progress isn\'t always visible, but it\'s happening.',
    author: 'Manoshi',
  },
  {
    id: '2',
    emoji: '🌤️',
    text: 'It\'s okay to not have everything figured out.',
    subtext: 'You\'re allowed to take life one day at a time.',
    author: 'Manoshi',
  },
  {
    id: '3',
    emoji: '💛',
    text: 'Your worth is not defined by your productivity.',
    subtext: 'You matter even on your slow days.',
    author: 'Manoshi',
  },
  {
    id: '4',
    emoji: '🦋',
    text: 'Comparison is a thief of joy.',
    subtext: 'Your journey is uniquely yours — honor it.',
    author: 'Manoshi',
  },
  {
    id: '5',
    emoji: '🎒',
    text: 'You don\'t have to carry everyone\'s expectations.',
    subtext: 'It\'s okay to put yourself first sometimes.',
    author: 'Manoshi',
  },
  {
    id: '6',
    emoji: '🤝',
    text: 'Asking for help is not weakness — it\'s wisdom.',
    subtext: 'You don\'t have to do this alone.',
    author: 'Manoshi',
  },
  {
    id: '7',
    emoji: '🛌',
    text: 'Rest is not laziness.',
    subtext: 'Your mind and body need time to recharge.',
    author: 'Manoshi',
  },
  {
    id: '8',
    emoji: '✨',
    text: 'You are more than your job title or salary.',
    subtext: 'You are whole as you are.',
    author: 'Manoshi',
  },
  {
    id: '9',
    emoji: '🚪',
    text: 'It\'s okay to set boundaries, even with people you love.',
    subtext: 'That\'s self-respect, not selfishness.',
    author: 'Manoshi',
  },
  {
    id: '10',
    emoji: '🌅',
    text: 'Today is a fresh start.',
    subtext: 'Let go of yesterday\'s worries and show up for yourself.',
    author: 'Manoshi',
  },
];

export function getDailyAffirmation(): Affirmation {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return affirmations[dayOfYear % affirmations.length];
}
