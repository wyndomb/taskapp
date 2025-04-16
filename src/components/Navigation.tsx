"use client";

import { NavigationProps } from "@/lib/types";
import Link from "next/link";
import LoginButton from "./auth/LoginButton";
import UserProfile from "./auth/UserProfile";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm mb-8 rounded-lg">
      <div className="flex justify-between items-center p-2">
        <div className="flex space-x-1 p-1">
          <button
            onClick={() => onViewChange("day")}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === "day"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => onViewChange("calendar")}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === "calendar"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Calendar
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus:outline-none rounded-full p-1 hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <UserProfile />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-500 cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
