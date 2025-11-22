# Barlingo - Duolingo for Bartenders MVP

## Overview

Barlingo is a gamified learning platform for bartenders, offering interactive lessons, quizzes, and progress tracking similar to Duolingo's language learning model.

## Project Structure

- **mobile/** - React Native mobile app (iOS/Android)
- **web/** - Next.js web application
- **backend/** - Firebase Cloud Functions and Firestore
- **docs/** - API and schema documentation

## Quick Start

### Backend Setup

```bash
cd backend/functions
npm install
npm run build
firebase emulators:start
```

### Web Setup

```bash
cd web
npm install
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npm start
```

## Documentation

- [Folder Structure](STRUCTURE.md)
- [Firestore Schema](docs/SCHEMA.md)
- [API Documentation](docs/API.md)

## Tech Stack

- **Frontend**: React Native (Mobile), Next.js (Web)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Language**: TypeScript
- **Payments**: Stripe
