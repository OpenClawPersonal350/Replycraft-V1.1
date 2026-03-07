import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name?: string;
    avatarUrl?: string;
    email?: string;
  } | null;
  className?: string;
}

// API base URL for resolving relative avatar URLs
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const name = user?.name || "User";
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Resolve avatar URL - handle both absolute and relative paths
  const getAvatarSrc = (): string | null => {
    if (!user?.avatarUrl) return null;
    
    // Already a full URL
    if (user.avatarUrl.startsWith('http')) {
      // Add cache busting query param
      return `${user.avatarUrl}?t=${Date.now()}`;
    }
    
    // Relative URL - prepend API base URL with cache busting
    return `${API_BASE_URL}${user.avatarUrl}?t=${Date.now()}`;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <Avatar className={className}>
      {avatarSrc ? (
        <AvatarImage src={avatarSrc} alt={name} />
      ) : (
        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
