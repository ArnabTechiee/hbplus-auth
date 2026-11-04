# HB+ Portal

A web app built with React Native for Web (Expo) and Firebase.
Users sign in with Google, and access is restricted to `@hbplus.fit` email addresses.

**Live demo:** [hbplusdemo.netlify.app](https://hbplusdemo.netlify.app/)
**Source code:** [github.com/ArnabTechiee/hbplus-auth](https://github.com/ArnabTechiee/hbplus-auth)

## Tech stack
- React Native for Web (Expo, Expo Router)
- Firebase Authentication (Google OAuth 2.0)
- Cloud Firestore (user records, roles)
- TypeScript
- Deployed on Netlify

## Setup
1. Clone the repo (`git clone https://github.com/ArnabTechiee/hbplus-auth.git`) and run `npm install`.
2. Create a Firebase project, enable **Authentication → Google** and create a **Firestore** database.
3. Copy `.env.example` to `.env` and fill in your Firebase web app values.
4. Publish the Firestore rules from [`firestore.rules`](./firestore.rules).
5. Run `npx expo start`, then press `w` for web.

## Authentication flow
1. The user clicks **Continue with Google**.
2. Firebase returns the signed-in Google account.
3. `AuthContext` checks the email domain on every auth state change.
4. Allowed domain: a session is kept and the user document is created or loaded from Firestore (`users/{uid}`).
5. Any other domain: the user is signed out immediately and sees
   "Access restricted. Please login using your official domain email."
6. Route groups guard the pages. Signed-out users are redirected to `/login`, and signed-in users are redirected away from it.

## How domain restriction works
- **Client:** `src/lib/domain.ts` validates the email suffix (`@hbplus.fit`) inside `AuthContext`, so it applies on every login and every page reload.
- **Server:** Firestore security rules reject any request whose token email is not `@hbplus.fit` and verified.
- The Google `hd` parameter is deliberately not relied on, since it is only a picker hint and can be bypassed.

## Roles
- New users default to `user`.
- `admin` is assigned manually in the Firestore console.
- Rules prevent users from changing their own role.
- Admins see a user list on the dashboard.

## Token handling
- Firebase manages ID tokens and refreshes them automatically. No tokens are stored manually or put in URLs.
- Web persistence uses Firebase's default browser persistence.
- Sign out clears the session.

## Folder structure
```
src/
  app/          routes ((auth)/login, (app)/index)
  components/   shared UI
  context/      AuthContext (session, role, domain check)
  hooks/        Google sign-in
  lib/          firebase setup, domain rules, error messages
```

## Known limitations
- Web only; there is no native mobile build.
- Admin roles must be assigned manually in the Firestore console (no in-app role management).
