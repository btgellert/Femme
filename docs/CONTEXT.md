# Fitness App - Functional Overview

## Table of Contents
1. [Introduction](#introduction)
2. [User Roles](#user-roles)
3. [App Navigation](#app-navigation)
4. [Authentication](#authentication)
5. [Feature Details](#feature-details)
6. [Subscription System](#subscription-system)
7. [Admin Functionality](#admin-functionality)

## Introduction
The fitness app is a comprehensive platform offering diet planning, exercises, and personal training services with both free and premium content options. This document outlines the core functionality, user flows, and features.

## Tech Stack:
- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper
- AI Processing: DeepSeek

## Database Schema

### Tables

#### users
- id: uuid (PK)
- email: string (unique)
- password_hash: string
- full_name: string
- role: enum ('regular', 'premium', 'admin')
- created_at: timestamp
- updated_at: timestamp
- profile_image_url: string (nullable)
- subscription_status: enum ('free', 'premium')
- subscription_end_date: timestamp (nullable)

#### diet_plans
- id: uuid (PK)
- title: string
- description: text
- is_premium: boolean
- created_at: timestamp
- updated_at: timestamp
- created_by: uuid (FK -> users.id)
- thumbnail_url: string

#### meals
- id: uuid (PK)
- diet_plan_id: uuid (FK -> diet_plans.id)
- name: string
- description: text
- nutritional_info: jsonb
- ingredients: jsonb[]
- preparation_steps: text[]
- image_url: string

#### exercises
- id: uuid (PK)
- title: string
- description: text
- difficulty_level: enum ('beginner', 'intermediate', 'advanced')
- is_premium: boolean
- video_url: string
- thumbnail_url: string
- instructions: text[]
- muscle_groups: string[]
- created_at: timestamp
- created_by: uuid (FK -> users.id)

#### workout_plans
- id: uuid (PK)
- title: string
- description: text
- is_premium: boolean
- duration_weeks: integer
- created_at: timestamp
- created_by: uuid (FK -> users.id)

#### workout_exercises
- id: uuid (PK)
- workout_plan_id: uuid (FK -> workout_plans.id)
- exercise_id: uuid (FK -> exercises.id)
- sets: integer
- reps: integer
- rest_time: integer
- order: integer

#### training_sessions
- id: uuid (PK)
- trainer_id: uuid (FK -> users.id)
- client_id: uuid (FK -> users.id)
- scheduled_at: timestamp
- status: enum ('scheduled', 'completed', 'cancelled')
- notes: text
- created_at: timestamp

#### user_progress
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- weight: float
- body_measurements: jsonb
- progress_photos: string[]
- date_recorded: timestamp

#### user_subscriptions
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- plan_type: enum ('monthly', 'yearly')
- start_date: timestamp
- end_date: timestamp
- status: enum ('active', 'cancelled', 'expired')
- payment_id: string

## Project Structure

```
fitness-app/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── home/
│   │   ├── diet/
│   │   ├── exercises/
│   │   ├── training/
│   │   └── profile/
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared components
│   │   ├── diet/           # Diet-specific components
│   │   ├── exercise/       # Exercise-specific components
│   │   └── training/       # Training-specific components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   │   ├── api/           # API endpoints
│   │   ├── supabase/      # Supabase client and queries
│   │   └── ai/            # AI integration services
│   ├── store/             # State management
│   │   ├── atoms/         # Recoil atoms
│   │   └── selectors/     # Recoil selectors
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   └── constants/         # App constants
├── assets/                # Static assets
│   ├── images/
│   ├── fonts/
│   └── animations/
├── docs/                  # Documentation
├── tests/                 # Test files
├── .env.example          # Environment variables example
├── app.config.ts         # Expo config
├── package.json
└── tsconfig.json
```

## User Roles

### Regular User
- Can sign in and browse free content
- Option to upgrade to premium subscription


### Premium User
- Full access to all content
- Personal training features
- Advanced tracking capabilities

### Admin User
- Content management capabilities
- User management access
- System configuration rights

## App Navigation

The app features a bottom navigation bar with the following sections:

| Section | Description |
|---------|-------------|
| Home | Overview and welcome page |
| Diet | Free and premium diet plans |
| Exercises | Free and premium exercise routines |
| Personal Training | Premium-exclusive feature |
| Profile | Account settings and subscription management |

## Authentication

- **Sign Up/Login**
  - Email and password authentication
  - Required for premium content access
  - Separate admin credentials system

## Feature Details

### Diet Page
- Comprehensive diet plan listings
- Mix of free and premium content
- Detailed nutritional information
- Meal planning capabilities

### Exercise Page
- Extensive exercise library
- Video demonstrations
- Detailed step-by-step instructions
- Premium content restrictions

### Personal Training Page
> **Premium Users Only**
- Personal trainer booking system
- Interactive calendar scheduling
- Custom content delivery
- Article-style presentations with multimedia

### Profile Page
- User information management
- Subscription status display
- Plan management options
- Account controls

## Subscription System

### Free Tier
- Basic diet content access
- Limited exercise library
- Core features

### Premium Tier
- Complete content access
- Personal training features
- Enhanced functionality

## Admin Functionality

### Content Management
- Diet and exercise content creation
- Content editing capabilities
- Content removal options

### User Management
- Personal training page customization
- User profile management
- Content access control

### System Features
- Custom content delivery
- Multimedia content management
- Training session scheduling

---

*This documentation serves as a comprehensive reference for developers implementing the fitness app functionality.*
