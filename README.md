# Antara (अंतरा)

**Because, you matter.**

A mental health app for Indian millennials, built as an extension of [Manoshi Vin's](https://www.manoshivin.com/) therapy practice. "Antara" means "inner self" in Hindi/Sanskrit.

All clinical content — journal prompts, affirmations, and breathing guidance — is authored by Manoshi Vin, LCSW (15+ years in mental health).

## Features

- **Breathe** — Guided breathing exercises (Box, 4-7-8, Calm) with animated visual cues
- **Ground** — 5-4-3-2-1 sensory grounding technique with interactive steps
- **Journal** — Therapist-crafted daily prompts across themes like family, self-worth, and work stress
- **Affirm** — Swipeable daily affirmations by Manoshi
- **Mood tracking** — Daily check-in with streak tracking
- **Patient mode** — Personalized content assignments from your therapist via invite codes
- **Therapist dashboard** — In-app tools for Manoshi to manage patients and generate invite codes

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript (strict)
- Zustand for state management
- Supabase for auth + cloud sync
- AsyncStorage for offline-first persistence

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and anon key

# Start the dev server
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) to run on your phone, or press `i`/`a` for iOS/Android simulators.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL Editor
3. Copy your Project URL and anon key into `.env.local`

## Testing Therapist Mode

1. Sign up as Manoshi in the app
2. In the Supabase dashboard, run:
   ```sql
   UPDATE profiles SET role = 'therapist' WHERE id = '<manoshi-user-id>';
   ```
   (Find the user ID in the `profiles` table or `auth.users`)
3. Reopen the app — the Therapist Dashboard with Patients, Assign, and Codes tabs will appear
4. Generate an invite code from the Codes tab
5. Sign up as a different user, enter the invite code from the Home screen to unlock patient mode

## License

Private — not open source.
