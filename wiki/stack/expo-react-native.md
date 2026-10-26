---
title: Expo and React Native (SDK 58)
summary: How to set up, extend and ship the repo's Expo SDK 58 starter. Covers npx expo install, App.js vs Expo Router, EXPO_PUBLIC_ env vars (bundled, never secret), accessibility props, web export, Expo Go limits on iPhone, and common pitfalls.
tags: [stack, expo, react-native, mobile, accessibility, env-vars]
last_verified: 2026-10-23
next_review: 2027-01-15
review_owner: ERI web team lead
confidence: medium
sources:
  - title: Expo SDK reference v58.0.0 (version table)
    url: https://docs.expo.dev/versions/v58.0.0
    accessed: 2026-10-23
  - title: Expo SDK 58 beta changelog
    url: https://expo.dev/changelog/sdk-58-beta
    accessed: 2026-10-23
  - title: Expo docs llms.txt
    url: https://docs.expo.dev/llms.txt
    accessed: 2026-10-23
  - title: Expo, Create a project
    url: https://docs.expo.dev/get-started/create-a-project.md
    accessed: 2026-10-23
  - title: Expo, create-expo-app templates
    url: https://docs.expo.dev/more/create-expo.md
    accessed: 2026-10-23
  - title: Expo, Using libraries (npx expo install)
    url: https://docs.expo.dev/workflow/using-libraries.md
    accessed: 2026-10-23
  - title: Expo, Environment variables
    url: https://docs.expo.dev/guides/environment-variables.md
    accessed: 2026-10-23
  - title: Expo, Publishing websites
    url: https://docs.expo.dev/guides/publishing-websites.md
    accessed: 2026-10-23
  - title: Expo, Expo Go version mismatch
    url: https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
    accessed: 2026-10-23
  - title: Expo changelog, Expo Go and the App Store (May 2026)
    url: https://expo.dev/changelog/expo-go-and-app-store-may-2026.md
    accessed: 2026-10-23
  - title: React Native, Accessibility
    url: https://reactnative.dev/docs/accessibility
    accessed: 2026-10-23
  - title: React Native, AccessibilityInfo
    url: https://reactnative.dev/docs/accessibilityinfo
    accessed: 2026-10-23
  - title: React Native, SafeAreaView (deprecated)
    url: https://reactnative.dev/docs/safeareaview
    accessed: 2026-10-23
---

# Expo and React Native (SDK 58)

## TL;DR
- The starter is on **Expo SDK 58**: `expo ~58.0.17`, **React Native 0.88**, **React 19.3.0**, react-native-web 0.21. It needs **Node 22.13+**, 24.3+ or 26+, and odd-numbered Node releases aren't supported. `docs.expo.dev/versions/latest/` showed v58 on 2026-10-23.
- **Always `npx expo install <pkg>`**, never `npm install <pkg>`. It picks the version that matches the SDK.
- **`EXPO_PUBLIC_*` values are inlined into the JS bundle in plain text.** Only public values go there (the Supabase URL and publishable/anon key). Never a secret.
- **Expo Go on a physical iPhone may not run SDK 58 yet.** Demo on **web (press `w`)**, Android Expo Go, or the iOS Simulator (verify on the day).

## Minimal working example
```bash
cd starters/expo-supabase
npm install                 # first run only: installs what package.json already pins
npx expo start              # w = web, a = Android, i = iOS simulator, or scan the QR code
npx expo install expo-haptics   # adding a package later: ALWAYS this form
npx expo-doctor             # if anything looks off; then: npx expo install --fix
```

A screen that matches `App.js`: single file, no router, with accessibility props.
```jsx
import { useState } from 'react';
import { Pressable, Text, TextInput, View, AccessibilityInfo, Platform } from 'react-native';
import { jobFit } from './lib/job-fit'; // copy of the challenge 02 core, exported as an ES module

export function FitCheck() {
  const [hours, setHours] = useState('');
  const [result, setResult] = useState(null);
  function check() {
    const r = jobFit({ hoursPerWeek: hours, wagePerHour: 15, benefit: 'SSI', nearBus: true });
    setResult(r);
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(`About ${r.monthlyEarnings} dollars a month`);
  }
  return (
    <View>
      <Text nativeID="hoursLabel" style={{ fontSize: 18, fontWeight: '600' }}>Hours each week</Text>
      <TextInput value={hours} onChangeText={setHours} keyboardType="number-pad"
        accessibilityLabel="Hours each week" accessibilityLabelledBy="hoursLabel"
        style={{ borderWidth: 2, borderColor: '#555', borderRadius: 8, padding: 12, fontSize: 18, minHeight: 48 }} />
      <Pressable onPress={check} accessibilityRole="button" accessibilityLabel="Check this job"
        hitSlop={8} style={{ minHeight: 48, minWidth: 48, justifyContent: 'center', backgroundColor: '#0b5cad', borderRadius: 8, marginTop: 12 }}>
        <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>Check this job</Text>
      </Pressable>
      {/* Android announces changes here; iOS uses announceForAccessibility above */}
      <Text accessibilityLiveRegion="polite" style={{ fontSize: 18, marginTop: 12 }}>
        {result ? `About $${result.monthlyEarnings} a month. ${result.disclaimer}` : ''}
      </Text>
    </View>
  );
}
```
`challenges/02-job-fit-checker/web/job-fit.js` is a browser IIFE. For Expo, copy the function body into `lib/job-fit.js` with `export function jobFit…`, or require the UMD file (verify that Metro resolves it). Keep the tests pointing at one source of truth.

### App.js vs Expo Router
- The **repo starter deliberately uses a single `App.js` + `index.js`** (`registerRootComponent(App)`), with no router. Keep it for one or two screens.
- A **new** project from `npx create-expo-app@latest --template default@sdk-58` uses **Expo Router** (file-based routes, TypeScript). `--template blank` has no navigation. While Expo is between SDK versions, leaving out the template tag gave an SDK 57 project, per the create-a-project page on 2026-10-23.
- `starters/expo-supabase/AGENTS.md` contains the Expo template's Router rules ("Routes live in `src/app/`"). **They don't apply to this starter.** Tell your AI assistant so.

### Env vars
```bash
# .env (git-ignored in this starter)
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-OR-PUBLISHABLE-KEY
```
- Read them only as `process.env.EXPO_PUBLIC_NAME`. **Bracket access and destructuring are not inlined.**
- Load order (development): `.env.development.local` > `.env.local` > `.env.development` > `.env`. In SDK 58, other names such as `.env.staging` are ignored, and Expo CLI now sets `NODE_ENV` before it loads `.env` files.
- After you edit `.env`, do a full reload in the app. A restart isn't required.

### Web export (the easiest thing to hand off)
```bash
npx expo export -p web      # writes dist/ (single-page app by default, web.output: "single")
npx expo serve              # preview dist/ at http://localhost:8081
```
`tools/check.sh` already runs `npx expo export --platform web` as a smoke test.

## Do / Don't checklist
- [ ] **Do** check `package.json` for the `expo` major version and read `docs.expo.dev/versions/v58.0.0/` before trusting any snippet.
- [ ] **Do** test on web and on at least one real screen reader (TalkBack on Android, VoiceOver on iOS).
- [ ] **Do** keep touch targets at 48 dp or more (`minHeight: 48`, `hitSlop`), labels on every `TextInput`, and `accessibilityRole="header"` on titles.
- [ ] **Don't** create or edit `ios/` or `android/` folders. They're generated (Continuous Native Generation). Configure through `app.json`.
- [ ] **Don't** add a library with custom native code if you'll demo in Expo Go. It needs a development build.
- [ ] **Don't** `npm i -g expo-cli`. It's deprecated, so use `npx expo`. And `expo eject` is gone; the replacement is `npx expo prebuild`.
- [ ] **Don't** rely on `placeholder` as the label.

## Security
- Everything in `EXPO_PUBLIC_*` and everything in the bundle is readable by anyone with the app or web build. **Never** put a Supabase `service_role`/secret key, an LLM API key or a database password there.
- LLM calls from a mobile app need a server in between (a Supabase Edge Function or the PHP helper). For the hackathon, mock them.
- Data: synthetic only. The starter falls back to `data/job_postings.json` when no Supabase env vars are set. Keep that offline path working for the demo.

## Accessibility
| Need | React Native prop | Notes |
| --- | --- | --- |
| Name | `accessibilityLabel` (or `aria-label`) | Touchables default to their child text |
| Purpose | `accessibilityRole` (`button`, `header`, `link`, `checkbox`, `radio`, `switch`, `search`…) | `role` takes precedence. Its values differ: `heading` vs `header`, `img` vs `image` |
| State | `accessibilityState={{ checked, selected, disabled, expanded, busy }}` | |
| Extra hint | `accessibilityHint` | TalkBack always reads it; VoiceOver only if hints are on |
| Group | `accessible` on a `View` | Starter list rows do this with one combined label |
| Announce changes | `accessibilityLiveRegion="polite"` | **Android only**. On iOS use `AccessibilityInfo.announceForAccessibility()` |
| Reduce motion | `AccessibilityInfo.isReduceMotionEnabled()` | Skip animations if true |
| Move focus | `AccessibilityInfo.sendAccessibilityEvent(ref, 'focus')` | `setAccessibilityFocus` is deprecated |

The starter's `App.js` hard-codes light colors (`userInterfaceStyle: "light"`). If you add dark mode, check contrast for both themes.

## Common AI-assistant mistakes to watch for
- `npm install some-lib` or `yarn add`. Re-run it as `npx expo install some-lib`.
- Generating `app/_layout.tsx` and Router code inside this single-`App.js` starter, or the other way round.
- `const { EXPO_PUBLIC_X } = process.env` or `process.env['EXPO_PUBLIC_X']`. These come out undefined at runtime.
- `import { SafeAreaView } from 'react-native'`. It's **deprecated** in favor of `react-native-safe-area-context`, and its `padding` styles are ignored. The starter's `App.js` still does this, so its `padding: 16` may not apply. Fix it with `npx expo install react-native-safe-area-context` and use its `SafeAreaView`.
- Old SDK APIs. SDK 58 changed `expo-file-system` (`File.write()` is async), removed libSQL from `expo-sqlite`, and RN 0.87 removed `InteractionManager`. Check the versioned docs.
- `expo eject`, "managed vs bare workflow", and `expo build:ios`. Expo's own llms.txt lists these as outdated.
- `accessibilityLiveRegion` treated as cross-platform.

## How to hand off to ERI
1. Ship the **web export** (`dist/`) as the primary artifact, because ERI's team runs websites. Store builds and EAS need an Apple or Google developer account that ERI would own. Don't create accounts for them.
2. In the README, include the run steps, the exact `expo` version, the Node version you used, and whether the app works without Supabase (bundled data).
3. Commit `.env.example`, never `.env`.
4. Run `npx expo-doctor` and note any warnings you left in place.

## Sources
- [Expo v58.0.0 reference](https://docs.expo.dev/versions/v58.0.0): RN 0.88, React 19.3.0, Node 22.13+
- [SDK 58 beta changelog](https://expo.dev/changelog/sdk-58-beta): breaking changes, Node versions, Expo Go notes (beta dated 2026-09-15)
- [Expo llms.txt](https://docs.expo.dev/llms.txt) · [Create a project](https://docs.expo.dev/get-started/create-a-project.md) · [create-expo templates](https://docs.expo.dev/more/create-expo.md)
- [Using libraries](https://docs.expo.dev/workflow/using-libraries.md) · [Environment variables](https://docs.expo.dev/guides/environment-variables.md) · [Publishing websites](https://docs.expo.dev/guides/publishing-websites.md)
- [Expo Go version mismatch](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) · [Expo Go and the App Store, May 2026](https://expo.dev/changelog/expo-go-and-app-store-may-2026.md)
- [RN Accessibility](https://reactnative.dev/docs/accessibility) · [RN AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo) · [RN SafeAreaView](https://reactnative.dev/docs/safeareaview)
