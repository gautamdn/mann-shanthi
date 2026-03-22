import { useUserStore } from '../store/userStore';

export function useStreak() {
  const streak = useUserStore((state) => state.streak);
  const updateStreak = useUserStore((state) => state.updateStreak);

  return { streak, updateStreak };
}
