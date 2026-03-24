# Mann Shanthi (मन शांति)

## What this app is
A mental health app for Indian millennials focused on stress reduction. "Mann Shanthi" means "peace of mind" in Hindi/Sanskrit. Clinical content (journal prompts, affirmations, breathing guidance) is authored by **Manoshi**, a licensed therapist and the developer's sister-in-law.

## Stack
- **React Native** with **Expo** (managed workflow)
- **TypeScript** — strict mode, no `any`
- **React Navigation** — bottom tabs + stack
- **Reanimated 2** — all animations
- **Zustand** — global state
- **AsyncStorage** — local persistence (no backend in v1)
- **expo-haptics** — tactile feedback on key interactions
- **expo-linear-gradient** — subtle gradients on hero elements only

## Project structure
```
src/
  navigation/       # RootNavigator, MainTabNavigator, types
  screens/          # onboarding/, home/, breathe/, ground/, journal/, affirm/
  components/       # common/, home/, breathe/
  hooks/            # useMoodLog, useStreak, useJournal
  store/            # userStore (Zustand)
  content/          # affirmations, journalPrompts, breathingTechniques
  theme/            # colors, typography, spacing
  utils/            # storage, dateUtils
```

## Design language
- **Primary:** Purple `#7C3AED` (calm, trustworthy)
- **Background:** Warm off-white `#F7F3EF` (not cold white)
- **Cards:** Pure white `#FFFFFF` with soft border `#EDE8E3`
- **Accent green:** `#059669` (grounding), amber `#D97706` (journal), pink `#DB2777` (affirm)
- **Border radius:** 20px for cards, 12px for inputs, 999px for pills
- **Typography:** Inter font family. 22px headings / 16px body / 13px captions
- **No harsh blacks** — use `#2d2323` for primary text, `#9e8f8f` for muted

## Tone & content voice
- Warm, non-preachy, feels like advice from a trusted friend
- Acknowledges Indian-specific stressors: family pressure, career comparison, work-life imbalance
- Avoid clinical jargon — Manoshi's content is intentionally accessible
- Hinglish-friendly (English with natural Hindi words like "yaar", "bas", "thoda")

## Key screens
1. **Onboarding** — name entry, 3 value screens, notification opt-in
2. **Home** — greeting by name, mood check-in, feature cards, streak, SOS calm
3. **Breathe** — box / 4-7-8 / calm techniques with Reanimated circle
4. **Ground** — 5-4-3-2-1 sensory grounding, tappable steps with text input
5. **Journal** — therapist prompt of the day + theme chips + free write + history
6. **Affirm** — swipeable daily affirmations by Manoshi

## State shape (Zustand)
```ts
{
  userName: string
  hasOnboarded: boolean
  moodLog: { date: string; mood: 1|2|3|4|5 }[]
  streak: number
  lastActiveDate: string
  journalEntries: { id: string; date: string; prompt: string; body: string }[]
}
```

## Coding conventions
- Functional components only, no class components
- Named exports for components, default exports for screens
- Styles via `StyleSheet.create` at bottom of each file
- No inline styles except for truly dynamic values
- All colors imported from `src/theme/colors.ts` — never hardcode hex values
- Spacing from `src/theme/spacing.ts` — use the scale, not magic numbers
- All AsyncStorage access goes through `src/utils/storage.ts` helpers

## What NOT to do
- No backend or auth in v1 — everything is local
- No third-party analytics yet
- No paid/subscription gating in v1
- Don't use `any` type
- Don't hardcode user name — always pull from store
- Don't add new dependencies without checking if Expo SDK includes it first

## Animation approach
- Use React Native's built-in `Animated` API — NOT Reanimated
- `react-native-reanimated` is in package.json for Expo compatibility but should NOT be imported in source code
- Swipe gestures use `PanResponder` from React Native

## Current phase
**Day 2 of 4-day sprint to TestFlight.**

### Completed
- [x] Theme system (colors, typography, spacing)
- [x] Navigation shell (bottom tabs + stack with onboarding gate)
- [x] Zustand store with AsyncStorage persistence
- [x] All 6 screens built to spec (Home, Breathe, Ground, Journal, Affirm, Onboarding)
- [x] Reusable components (ScreenWrapper, Card, PillButton, MoodSelector, FeatureCard, BreathingCircle)
- [x] Therapist-authored content (affirmations, journal prompts, breathing techniques)
- [x] Custom hooks (useMoodLog, useStreak, useJournal)
- [x] Running on Expo Go (SDK 54)

### Next up
- [ ] Polish: transitions, empty states, keyboard handling
- [ ] Splash screen + app icon branding
- [ ] Manoshi profile photo in onboarding
- [ ] TestFlight build via EAS