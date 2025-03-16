import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.email || "User";

  return (
    <div className="flex items-center space-x-2">
      {avatarUrl ? (
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
