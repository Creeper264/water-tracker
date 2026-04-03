# Water Tracker

A beautiful and intuitive water tracking mobile app built with React Native and Expo. Track your daily water intake, view statistics, and stay hydrated with smart reminders.

## Features

- **Daily Water Tracking**: Track your water intake with quick-add buttons or custom amounts
- **Progress Visualization**: Beautiful circular progress ring showing your daily hydration goal
- **Statistics Dashboard**: View weekly water intake statistics with charts
- **Smart Reminders**: Configurable notification reminders to drink water
- **Sedentary Reminders**: Get notified when you haven't logged water for a while
- **Streak System**: Track your consistency with streak counting
- **Dark Theme**: Modern dark UI design for comfortable viewing

## Screenshots

| Home Screen | Statistics | Settings |
|-------------|------------|----------|
| Progress ring with daily goal | Weekly intake chart | Customize reminders & goals |

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **React Native Chart Kit** - Data visualization
- **React Native SVG** - Vector graphics
- **Async Storage** - Local data persistence
- **Expo Notifications** - Push notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
```bash
git clone https://github.com/0verwhe1med/WaterTracker.git
cd water-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your device/simulator
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
water-tracker/
├── App.tsx              # App entry point
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── src/
│   ├── index.ts         # Main app component with navigation
│   ├── hooks/
│   │   └── useWaterTracker.ts  # Core water tracking logic
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Main tracking screen
│   │   ├── StatsScreen.tsx     # Statistics dashboard
│   │   └── SettingsScreen.tsx  # Settings configuration
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── utils/
│       ├── storage.ts          # Async storage utilities
│       └── notifications.ts    # Notification management
└── assets/                     # App icons and images
```

## Key Features Explained

### Water Tracking
- Quick-add buttons for common amounts (250ml, 500ml, 750ml, 1000ml)
- Real-time progress tracking with circular progress ring
- Daily log with timestamp for each entry
- Delete individual entries

### Statistics
- Weekly water intake visualization
- Streak tracking for consistency
- Progress towards weekly goals

### Settings
- Customize daily water goal
- Enable/disable notifications
- Set notification time window
- Configure sedentary reminders

## Version History

- **v1.3.0** - Current version
- **v1.2.0** - Added streak & pet system
- **v1.1.0** - Added sedentary reminder feature
- **v1.0.0** - Initial release

## Building for Production

### Android APK
```bash
npm run apk:release
```

Or use EAS Build:
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Author

**0verwhe1med**

---

Stay hydrated! 💧
