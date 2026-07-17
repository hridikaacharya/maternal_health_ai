# Sathi MHDSS

Sathi is now an Expo-based React Native app for maternal health decision support. The clinical rule engine, bilingual explanation layer, patient assessment wizard, FCHV dashboard, profile history, and AI explainer are all preserved in native form.

## Folder Structure

```text
app/
  _layout.jsx
  index.jsx
src/
  navigation/
    AppNavigator.jsx
  screens/
    HomeScreen.jsx
    LoginScreen.jsx
    PatientAssessmentScreen.jsx
    FchvDashboardScreen.jsx
    ProfileScreen.jsx
    AiExplainerScreen.jsx
  components/
    ...existing reusable UI pieces
  services/
    clinicalEngine.js
    geminiService.js
    storage.js
  theme/
    nativeTheme.js
```

## Run

```bash
npm install
npm start
```

For platform targets:

```bash
npm run android
npm run ios
npm run web
```

## Environment

Create a `.env.local` file from `.env.example` and add:

```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

## Notes

- The app uses `expo-router` entry scaffolding with a native navigator in `src/navigation/AppNavigator.jsx`.
- Assessment history is stored with AsyncStorage on native and localStorage on web.
- The web-only Vite files were removed because they are no longer part of the runtime.