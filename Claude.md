# Antara (अंतरा)

## What this app is
A mental health app for Indian millennials, branded as an extension of **Manoshi Vin's** therapy practice (manoshivin.com). "Antara" means "inner self" / "within" in Hindi/Sanskrit. Tagline: **"Because, you matter."** Clinical content is authored by Manoshi, a licensed therapist (LCSW, 15+ years).

## Stack
- **React Native** with **Expo** (managed workflow, SDK 54)
- **TypeScript** — strict mode, no `any`
- **React Navigation** — bottom tabs + stack
- **Zustand** — global state (authStore, userStore)
- **AsyncStorage** — local persistence (offline fallback)
- **Supabase** — auth (email/password) + cloud database + invite code RPC
- **@expo/vector-icons** (Feather) — tab and feature icons
- **expo-haptics** — tactile feedback on key interactions

## Project structure
```
src/
  lib/              # supabase client config
  services/         # syncService (offline-first Supabase sync)
  navigation/       # RootNavigator, MainTabNavigator, TherapistTabNavigator, types
  screens/          # auth/, onboarding/, home/, breathe/, ground/, journal/, affirm/, settings/, therapist/
  components/       # common/, home/, breathe/
  hooks/            # useMoodLog, useStreak, useJournal, useContentMode
  store/            # authStore, userStore (Zustand)
  content/          # affirmations, journalPrompts, breathingTechniques
  types/            # assignments (PatientAssignment interfaces)
  theme/            # colors, typography, spacing
  utils/            # storage, dateUtils
```

## Design language
- **Primary:** Warm brown-gold `#8B7355` (refined, professional)
- **Background:** Cream `#F5F0EB`
- **Cards:** Pure white `#FFFFFF` with soft border `#E5E0DB`
- **Text:** Dark charcoal `#2D2D2D`, muted warm brown `#7C6E60`
- **No emoji** — Feather line icons throughout
- **Border radius:** 20px for cards, 12px for inputs, 999px for pills
- **Typography:** Inter font family. 20px headings / 16px body / 13px captions / 14px subtitle+tagline

## Tone & content voice
- Warm, professional English matching manoshivin.com
- Subtle Hinglish OK (e.g., "Namaste" greeting)
- Acknowledges Indian-specific stressors: family pressure, career comparison, work-life imbalance
- Avoid clinical jargon — Manoshi's content is intentionally accessible

## User roles
- **public** (default) — curated content subset, standalone self-help
- **patient** — unlocked via invite code from Manoshi, gets personalized assignments
- **therapist** — Manoshi's account, manages patients and invite codes via in-app dashboard

## Key screens
1. **Auth** — email/password sign in & sign up, "Skip for now", "Because, you matter." tagline
2. **Onboarding** — name entry, feature showcase (Feather icons), Meet Manoshi, final CTA
3. **Home** — greeting, mood check-in, feature cards, streak, invite code card (public) or assignments (patient), SOS calm
4. **Breathe** — box / 4-7-8 / calm techniques with animated circle, "Recommended for you" for patient assignments
5. **Ground** — 5-4-3-2-1 sensory grounding, numbered step circles, text input
6. **Journal** — therapist prompt / assigned prompt + theme chips + free write + history
7. **Affirm** — swipeable daily affirmations by Manoshi
8. **InviteCode** — code entry to upgrade to patient mode (modal)
9. **Therapist Dashboard** — Patients (placeholder), Assign (placeholder), Codes (functional)

## State shape (Zustand)
```ts
// authStore
{
  userId: string | null
  email: string | null
  role: 'public' | 'patient' | 'therapist'
  isAuthenticated: boolean
  isLoading: boolean
}

// userStore
{
  userName: string
  hasOnboarded: boolean
  hasSkippedAuth: boolean
  role: 'public' | 'patient' | 'therapist'
  moodLog: { date: string; mood: 1|2|3|4|5 }[]
  streak: number
  lastActiveDate: string
  journalEntries: { id: string; date: string; prompt: string; body: string }[]
  assignments: PatientAssignment[]
}
```

## Supabase integration
- **Auth**: Email/password via `supabase.auth`
- **Database tables**: `profiles` (with role), `mood_logs`, `journal_entries`, `invite_codes`, `patient_assignments` (all with RLS)
- **RPC**: `redeem_invite_code` — atomic invite code validation + role upgrade
- **Offline-first**: Every mutation writes to AsyncStorage immediately, then fire-and-forget to Supabase. Full bidirectional sync on app launch if authenticated.
- **Config**: Environment variables `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

## Coding conventions
- Functional components only, no class components
- Named exports for components, default exports for screens
- Styles via `StyleSheet.create` at bottom of each file
- No inline styles except for truly dynamic values
- All colors imported from `src/theme/colors.ts` — never hardcode hex values
- Spacing from `src/theme/spacing.ts` — use the scale, not magic numbers
- All AsyncStorage access goes through `src/utils/storage.ts` helpers
- Content gating via `useContentMode` hook — screens don't check roles directly

## What NOT to do
- No third-party analytics yet
- No paid/subscription gating in v1
- Don't use `any` type
- Don't hardcode user name — always pull from store
- Don't add new dependencies without checking if Expo SDK includes it first
- Don't use emoji in UI — use Feather icons

## Animation approach
- Use React Native's built-in `Animated` API — NOT Reanimated
- `react-native-reanimated` is in package.json for Expo compatibility but should NOT be imported in source code
- Swipe gestures use `PanResponder` from React Native

## Current phase
**Day 3 of sprint.** Rebrand complete.

### Completed
- [x] Theme system (colors, typography, spacing)
- [x] Navigation shell (bottom tabs + stack with onboarding gate)
- [x] Zustand store with AsyncStorage persistence
- [x] All screens built to spec
- [x] Reusable components (ScreenWrapper, Card, PillButton, MoodSelector, FeatureCard, BreathingCircle)
- [x] Therapist-authored content (affirmations, journal prompts, breathing techniques)
- [x] Custom hooks (useMoodLog, useStreak, useJournal, useContentMode)
- [x] Running on Expo Go (SDK 54)
- [x] Supabase integration (auth + data sync)
- [x] Visual rebrand to warm neutral palette (matching manoshivin.com)
- [x] Emoji removal — Feather icons throughout
- [x] Role system (public/patient/therapist) with invite codes
- [x] Therapist tab scaffold (Codes screen functional)
- [x] useContentMode hook for role-based content

### Next up
- [ ] Polish: transitions, empty states, keyboard handling
- [ ] Splash screen + app icon branding
- [ ] Build out therapist Patients and Assign screens
- [ ] Run v2 SQL migration in Supabase (see supabase-schema.sql)
- [ ] TestFlight build via EAS
