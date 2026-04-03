import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { getDailyPrompt } from '../content/journalPrompts';
import { breathingTechniques } from '../content/breathingTechniques';
import type { JournalPrompt } from '../content/journalPrompts';
import type { BreathingTechnique } from '../content/breathingTechniques';
import type { PatientAssignment, JournalAssignmentContent, BreathingAssignmentContent } from '../types/assignments';

export function useContentMode() {
  const role = useAuthStore((state) => state.role);
  const assignments = useUserStore((state) => state.assignments);

  const isPatient = role === 'patient';
  const isTherapist = role === 'therapist';

  const journalAssignment = assignments.find(
    (a: PatientAssignment) => a.type === 'journal_prompt' && !a.completedAt,
  );

  const breathingAssignment = assignments.find(
    (a: PatientAssignment) => a.type === 'breathing_exercise' && !a.completedAt,
  );

  const getJournalPrompt = (): { prompt: JournalPrompt; isAssigned: boolean } => {
    if (isPatient && journalAssignment) {
      const content = journalAssignment.content as JournalAssignmentContent;
      return {
        prompt: { id: journalAssignment.id, text: content.prompt, theme: content.theme },
        isAssigned: true,
      };
    }
    return { prompt: getDailyPrompt(), isAssigned: false };
  };

  const getBreathingTechnique = (): { techniques: BreathingTechnique[]; recommendedId: string | null } => {
    if (isPatient && breathingAssignment) {
      const content = breathingAssignment.content as BreathingAssignmentContent;
      return { techniques: breathingTechniques, recommendedId: content.techniqueId };
    }
    return { techniques: breathingTechniques, recommendedId: null };
  };

  return {
    isPatient,
    isTherapist,
    assignments,
    getJournalPrompt,
    getBreathingTechnique,
  };
}
