# HB+ Portal

A cross-platform app built with React Native (Expo, Expo Router) and Firebase.
Users sign in with Google, and access is strictly restricted to `@hbplus.fit` email addresses.

**Live demo:** [hbplusdemo.netlify.app](https://hbplusdemo.netlify.app/)  
**Source code:** [github.com/ArnabTechiee/hbplus-auth](https://github.com/ArnabTechiee/hbplus-auth)

## Tech stack
- React Native / React Native for Web (Expo, Expo Router)
- Firebase Authentication (Google OAuth 2.0)
- Native Google Sign-In (`@react-native-google-signin/google-signin`)
- Cloud Firestore (user records, roles)
- TypeScript
- Deployed on Netlify (Web) & Expo Prebuild (Android)

## Setup
1. Clone the repo (`git clone https://github.com/ArnabTechiee/hbplus-auth.git`) and run `npm install`.
2. Create a Firebase project, enable **Authentication → Google**, and create a **Firestore** database.
3. Copy `.env.example` to `.env` and fill in your Firebase values (including `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`).
4. Publish the Firestore rules from [`firestore.rules`](./firestore.rules).
5. **For Web:** Run `npx expo start`, then press `w`.
6. **For Android Native Build:** Google sign-in on native needs a development build, not Expo Go.
   Add your `google-services.json` to the project root, then run:
   ```
   npx expo install @react-native-google-signin/google-signin expo-dev-client
   npx expo prebuild
   npx expo run:android
   ```

## Authentication flow
1. The user clicks **Continue with Google**.
2. Firebase returns the signed-in Google account.
3. `AuthContext` checks the email domain on every auth state change.
4. **Allowed domain:** A session is kept, and the user document is created or loaded from Firestore (`users/{uid}`).
5. **Any other domain:** The user is signed out immediately and sees:
   *"Access restricted. Please login using your official domain email."*
6. Route groups guard the pages. Signed-out users are redirected to `/login`, and signed-in users are redirected away from it.

## How domain restriction works
- **Client:** `src/lib/domain.ts` validates the email suffix (`@hbplus.fit`) inside `AuthContext`, applying on every login and page reload.
- **Server:** Firestore security rules reject any request whose token email is not `@hbplus.fit` and verified.
- The Google `hd` parameter is deliberately not relied on, as it is only a picker hint and can be bypassed.

## Roles
- New users default to `user`.
- `admin` is assigned manually in the Firestore console.
- Security rules prevent users from changing their own role.
- Admins see a user list on the dashboard.

## Token handling
- Firebase manages ID tokens and refreshes them automatically. No tokens are stored manually or put in URLs.
- Web persistence uses Firebase's default browser persistence. Native persistence uses AsyncStorage.
- Sign out clears the session completely.

## Folder structure
```
src/
  app/          routes ((auth)/login, (app)/index)
  components/   shared UI components
  context/      AuthContext (session, role, domain check)
  hooks/        Google sign-in hooks (web & native platforms)
  lib/          Firebase setup, domain rules, error messages
```

## Platform support & known limitations
- **Platforms:** Fully functional on Web (via Netlify) and Android (via Expo Development Client/Prebuild).
- **Admin Roles:** Admin roles must be assigned manually in the Firestore console (no in-app role management UI).
