# Frontend

## Requirements

- node (works with 19.4.0)
- yarn or npm (works with yarn 1.22.19 or npm 9.2.0)
- React Native CLI (2.0.1)
- watchman (2023.05.08.00)

### Android Requirements

- Android Studio (2022.2.1)
- Android Platform 13.0
- Android SDK Build Tools (34-rc4)
- Android SDK command line tools
- Android Emulator (32.1.12)
- Android SDK Platform-Tools (34.0.1)
- JRE (Zulu11)

### iOS Requirements (Mac only)

- CocoaPods (1.11.3)
- Xcode (14.2)

### Build (only required if android and ios folders are missing)

- start terminal in Frontend root folder
- run "yarn/npm prebuild" to build android and ios folders

## Run App

- (only first time) run "yarn" in Frontend folder and "pod install" in ios folder
- start terminal in Frontend root folder
- run "yarn/npm start" to start Metro Bundler and press "i" to launch ios app or "a" to launch android app
  OR
- run "yarn/npm start", open second terminal window and run "yarn/npm ios/android" to start app on emulator or connected device
