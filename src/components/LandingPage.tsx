import { useAuth } from "@/context/AuthContext";
import LoginButton from "./auth/LoginButton";
import { Button } from "./ui/button";
import { CheckCircle } from "./ui/CheckCircle";

export default function WelcomeScreen() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b to-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Hero Section */}
        <div className="flex flex-col space-y-6 order-1 md:order-1">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Joytask
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mt-2 font-light">
              Celebrate every completed task
            </p>
          </div>

          <p className="text-slate-600 text-lg">
            A task management app that helps you stay organized and turns
            productivity into moments of joy.
          </p>

          <div className="mt-4">
            <LoginButton />
          </div>

          <p className="text-sm text-slate-500 mt-2">
            Your data is securely stored and only accessible to you.
          </p>
        </div>

        {/* Right Column - Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 order-2 md:order-2">
          <h3 className="text-xl font-semibold mb-5 text-primary">
            Why Joytask?
          </h3>

          <div className="space-y-5">
            <FeatureItem
              title="Celebrate Achievements"
              description="Experience delightful animations when you complete tasks"
            />

            <FeatureItem
              title="Intuitive Organization"
              description="View your tasks in daily or calendar format"
            />

            <FeatureItem
              title="Deadline Management"
              description="Set deadlines and never miss important tasks"
            />

            <FeatureItem
              title="Access Anywhere"
              description="Cloud sync keeps your tasks available on all devices"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-green-500 flex-shrink-0">
        <CheckCircle className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium text-slate-800">{title}</h4>
        <p className="text-slate-600 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
