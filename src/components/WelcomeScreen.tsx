import { useAuth } from "@/context/AuthContext";
import LoginButton from "./auth/LoginButton";

export default function WelcomeScreen() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Welcome to Joytask!
      </h2>
      <p className="text-gray-600 mb-6">
        Joytask is a task management app that helps you stay organized and
        celebrate your accomplishments.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Features:</h3>
        <ul className="text-left space-y-2 max-w-md mx-auto">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Track your daily tasks and celebrate completions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>View your tasks in a daily or calendar view</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Set deadlines and stay on top of your schedule</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Access your tasks from anywhere with cloud storage</span>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Sign in with Google to start tracking your tasks and access them from
          any device.
        </p>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-8">
        Your data is securely stored and only accessible to you.
      </p>
    </div>
  );
}
