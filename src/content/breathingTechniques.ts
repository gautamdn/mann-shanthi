export interface BreathingStep {
  label: string;
  duration: number; // seconds
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  steps: BreathingStep[];
  rounds: number;
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, hold. Great for calming the nervous system quickly.',
    steps: [
      { label: 'Breathe In', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Breathe Out', duration: 4 },
      { label: 'Hold', duration: 4 },
    ],
    rounds: 4,
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system. Helps with sleep and anxiety.',
    steps: [
      { label: 'Breathe In', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Breathe Out', duration: 8 },
    ],
    rounds: 4,
  },
  {
    id: 'calm',
    name: 'Calm Breathing',
    description: 'Simple deep breathing. Just slow down and be present with your breath.',
    steps: [
      { label: 'Breathe In', duration: 5 },
      { label: 'Breathe Out', duration: 5 },
    ],
    rounds: 6,
  },
];
