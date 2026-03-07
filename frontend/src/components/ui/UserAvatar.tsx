import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    name?: string;
    avatarUrl?: string;
    email?: string;
  } | null;
  className?: string;
}

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const name = user?.name || "User";
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  const resolvedAvatarUrl = user?.avatarUrl?.startsWith('http') 
    ? user.avatarUrl 
    : user?.avatarUrl ? `${baseUrl}${user.avatarUrl}` : undefined;

  return (
    <Avatar className={className}>
      <AvatarImage src={resolvedAvatarUrl} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
