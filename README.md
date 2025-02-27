# Joytask - A To-Do App That Celebrates Task Completion

Joytask is a modern to-do list application that celebrates task completion. The main screen shows both active and completed tasks side-by-side, emphasizing achievements.

## Features

- Create and delete tasks
- Set deadlines for tasks
- Check off completed tasks
- View completed tasks on the same screen as active tasks
- Track daily task completion statistics
- Modern, responsive UI
- Celebration animation when tasks are completed

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- date-fns for date formatting

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js app router files
- `src/components`: React components
- `src/lib`: Utility functions and TypeScript types

## User Flow

1. User creates tasks with optional deadlines
2. User checks off tasks when complete
3. Completed tasks remain visible in a "completed" section
4. App displays a running count of completed tasks per day

## Deployment

### Deploying to Vercel

This app is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Visit [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Keep the default settings and click "Deploy"
5. Your app will be deployed and available at a Vercel URL

### Build for Production

To build the app for production locally:

```bash
npm run build
# or
yarn build
```

To start the production server locally:

```bash
npm run start
# or
yarn start
```

## Data Persistence

Currently, the app uses browser localStorage for data persistence. This means:

- Tasks are stored in the user's browser
- Tasks will persist between sessions on the same device
- Tasks will not sync between different devices

## License

ISC
