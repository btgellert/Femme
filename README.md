# Fitness App

A comprehensive fitness application built with React Native, Expo, and Supabase.

## Features

- User Authentication (Login/Register)
- Diet Plans
- Exercise Routines
- Personal Training
- Progress Tracking
- Premium Content Access

## Tech Stack

- Frontend: React Native with TypeScript
- Framework: Expo with Expo Router
- UI: React Native Paper
- Backend: Supabase
- State Management: Recoil

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase Account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd FitnessApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your Supabase credentials.

4. Start the development server:
```bash
npm start
```

## Development

- `npm start` - Start the Expo development server
- `npm run android` - Start the app in Android emulator
- `npm run ios` - Start the app in iOS simulator
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
fitness-app/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   └── (tabs)/              # Main app tabs
├── src/
│   ├── components/          # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   ├── store/             # State management
│   └── types/             # TypeScript types
└── assets/                # Static assets
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
