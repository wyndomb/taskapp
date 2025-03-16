import { useAuth } from "@/context/AuthContext";

export default function LoginButton() {
  const { user, signIn, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <button
        className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md opacity-50 cursor-not-allowed"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      Sign In with Google
    </button>
  );
}
