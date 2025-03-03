# Development Setup Guide

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (Recommended: Latest LTS version)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) (for mobile development)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)
- [Firebase CLI](https://firebase.google.com/docs/cli) (if Firebase is used)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/innocodes/quicktransfer.git
   cd project
   ```

2. **Install dependencies:**

   ```sh
   yarn install  # or npm install
   ```

3. **Skip environment variables setup:**
   - Env was not used for ease of running the project on the interviewer's end.
   - I understand that the Firebase API I used is publicly exposed. I permitted this to avoid any other person having to setup a firebase project before they can run this app. Once the interview process is done, I will switch the repo into Private mode or better still deactivate the public key.

## Running the Development Server

### For Web (Next.js)

```sh
yarn dev  # or npm run dev
```

This will start the development server at `http://localhost:3000/`.

### For React Native (Mobile App)

#### Running on Android

```sh
yarn android  # or npm run android
```

Ensure you have an emulator running or a physical device connected.

#### Running on iOS

```sh
yarn ios  # or npm run ios
```

Only works on macOS with Xcode installed.

## Firebase Setup (If Applicable) - Already done!

1. Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) in the respective folders:

   - `android/app/google-services.json`
   - `ios/GoogleService-Info.plist`

2. Run Firebase authentication setup if needed.

## Troubleshooting

- If dependencies fail to install, try running:
  ```sh
  yarn cache clean  # or npm cache clean --force
  yarn install  # or npm install
  ```
- For Android issues, ensure your emulator/device is properly set up.
- For iOS issues, try running:
  ```sh
  cd ios && pod install
  cd ..
  yarn ios
  ```

## Backend Setup (Firebase)

1. Sign Up - Utilized Firebase createUserWithEmailAndPassword method:

   - `email`
   - `password`
   - `fullName`

2. Sign In - Utilized Firebase signInWithEmailAndPassword method.

   - `email`
   - `password`

3. Create Default Account - a default account is created for a new user during sign up.

   - `email`
   - `password`

4. 3. Add Accounts - Users can add new accounts on the Dashboard using the Add Account button

   - `bankName`
   - `accountNumber`
   - `balance`
   - `type`

## Contribution Guide

- Create feature branches (`feature/your-feature-name`).
- Submit PRs for review before merging into `main`.

For any additional support, please check the project documentation or reach out to the team.
