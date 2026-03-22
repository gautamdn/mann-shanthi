export interface JournalPrompt {
  id: string;
  text: string;
  theme: string;
}

export const journalPrompts: JournalPrompt[] = [
  {
    id: '1',
    text: 'What is one thing that made you smile today, even if it was small?',
    theme: 'Gratitude',
  },
  {
    id: '2',
    text: 'If you could tell your younger self one thing, what would it be?',
    theme: 'Self-worth',
  },
  {
    id: '3',
    text: 'What is one boundary you wish you could set with family? What holds you back?',
    theme: 'Family',
  },
  {
    id: '4',
    text: 'Describe a moment this week when you felt truly at peace. What were you doing?',
    theme: 'Gratitude',
  },
  {
    id: '5',
    text: 'What is one expectation from others that feels heavy? How would it feel to let it go?',
    theme: 'Family',
  },
  {
    id: '6',
    text: 'Write about someone who makes you feel safe. What do they do that creates that feeling?',
    theme: 'Relationships',
  },
  {
    id: '7',
    text: 'What does "enough" look like for you today? Not perfect — just enough.',
    theme: 'Self-worth',
  },
  {
    id: '8',
    text: 'When work stress hits, what is the first thing your body tells you? Where do you feel it?',
    theme: 'Work stress',
  },
  {
    id: '9',
    text: 'What is one thing you are doing right, that you rarely give yourself credit for?',
    theme: 'Self-worth',
  },
  {
    id: '10',
    text: 'What would your ideal Sunday morning look like? Why does that feel restorative?',
    theme: 'Overwhelm',
  },
  {
    id: '11',
    text: 'What does your inner critic say most often? Now rewrite that sentence as a friend would say it.',
    theme: 'Self-worth',
  },
  {
    id: '12',
    text: 'Write about a time you said "yes" when you wanted to say "no". What would you do differently?',
    theme: 'Overwhelm',
  },
  {
    id: '13',
    text: 'What is one small thing a colleague or friend did recently that meant a lot to you?',
    theme: 'Relationships',
  },
  {
    id: '14',
    text: 'If you could change one thing about your workday to reduce stress, what would it be?',
    theme: 'Work stress',
  },
  {
    id: '15',
    text: 'What family expectation are you carrying that doesn\'t actually belong to you?',
    theme: 'Family',
  },
  {
    id: '16',
    text: 'List three things you\'re grateful for right now — they can be as simple as chai.',
    theme: 'Gratitude',
  },
  {
    id: '17',
    text: 'When was the last time you felt truly overwhelmed? What helped you come back to yourself?',
    theme: 'Overwhelm',
  },
  {
    id: '18',
    text: 'What does a healthy relationship look like to you? How close is your reality to that?',
    theme: 'Relationships',
  },
];

export const journalThemes = [
  'Work stress',
  'Family',
  'Self-worth',
  'Overwhelm',
  'Relationships',
  'Gratitude',
] as const;

export function getDailyPrompt(): JournalPrompt {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return journalPrompts[dayOfYear % journalPrompts.length];
}

export function getPromptByTheme(theme: string): JournalPrompt {
  const matching = journalPrompts.filter((p) => p.theme === theme);
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return matching[dayOfYear % matching.length];
}
