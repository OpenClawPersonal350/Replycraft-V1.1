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

  // Resolve avatar URL - check if it's already a full URL first
  const getAvatarSrc = (): string | null => {
    const avatarUrl = user?.avatarUrl;
    if (!avatarUrl) return null;
    
    // Already a full URL (http:// or https://) - use as-is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // Relative URL - prepend API base URL
    return `${API_BASE_URL}${avatarUrl}`;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <Avatar className={className}>
      {avatarSrc ? (
        <AvatarImage 
          src={avatarSrc} 
          alt={name}
          onError={(e) => {
            // Hide the image element on error
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
