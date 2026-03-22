import { useUserStore } from '../store/userStore';
import { getToday } from '../utils/dateUtils';

export function useMoodLog() {
  const moodLog = useUserStore((state) => state.moodLog);
  const logMood = useUserStore((state) => state.logMood);

  const todayMood = moodLog.find((entry) => entry.date === getToday());
  const hasLoggedToday = todayMood !== undefined;

  return {
    moodLog,
    logMood,
    todayMood: todayMood?.mood ?? null,
    hasLoggedToday,
  };
}
