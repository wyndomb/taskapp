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

## License

ISC
