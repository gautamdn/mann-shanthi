export interface JournalPrompt {
  id: string;
  text: string;
  theme: string;
}

export const journalPrompts: JournalPrompt[] = [
  {
    id: '1',
    text: 'What is one thing that made you smile today, even if it was small?',
    theme: 'gratitude',
  },
  {
    id: '2',
    text: 'If you could tell your younger self one thing, what would it be?',
    theme: 'self-compassion',
  },
  {
    id: '3',
    text: 'What is one boundary you wish you could set? What holds you back?',
    theme: 'boundaries',
  },
  {
    id: '4',
    text: 'Describe a moment this week when you felt truly at peace. What were you doing?',
    theme: 'mindfulness',
  },
  {
    id: '5',
    text: 'What is one expectation from others that feels heavy? How would it feel to let it go?',
    theme: 'letting go',
  },
  {
    id: '6',
    text: 'Write about someone who makes you feel safe. What do they do that creates that feeling?',
    theme: 'relationships',
  },
  {
    id: '7',
    text: 'What does "enough" look like for you today? Not perfect — just enough.',
    theme: 'self-compassion',
  },
  {
    id: '8',
    text: 'If stress had a color and shape, what would yours look like right now?',
    theme: 'awareness',
  },
  {
    id: '9',
    text: 'What is one thing you are doing right, that you rarely give yourself credit for?',
    theme: 'gratitude',
  },
  {
    id: '10',
    text: 'What would your ideal Sunday morning look like? Why does that feel restorative?',
    theme: 'self-care',
  },
];

export const journalThemes = [
  'gratitude',
  'self-compassion',
  'boundaries',
  'mindfulness',
  'letting go',
  'relationships',
  'awareness',
  'self-care',
] as const;
