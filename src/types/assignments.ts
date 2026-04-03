export interface JournalAssignmentContent {
  prompt: string;
  theme: string;
}

export interface BreathingAssignmentContent {
  techniqueId: string;
  rounds: number;
  note: string;
}

export interface WeeklyPlanContent {
  title: string;
  tasks: { day: string; activity: string; completed: boolean }[];
}

export type AssignmentContent =
  | JournalAssignmentContent
  | BreathingAssignmentContent
  | WeeklyPlanContent;

export type AssignmentType = 'journal_prompt' | 'breathing_exercise' | 'weekly_plan';

export interface PatientAssignment {
  id: string;
  type: AssignmentType;
  content: AssignmentContent;
  assignedBy: string;
  assignedAt: string;
  completedAt: string | null;
}
