'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserAvatarProps {
  image: string
  name?: string
  isOnline?: boolean
}

const UserAvatar: React.FC<UserAvatarProps> = ({ image, name, isOnline }) => {
  return (
    <div className="relative">
      <Avatar className="h-11 w-11 rounded-full mr-3">
        <AvatarImage src={image || '/images/noUser.webp'} alt="profile" />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      {/* 온라인 상태 점 */}
      {isOnline && (
        <span className="absolute bottom-0 right-3 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
      )}
    </div>
  );
};

export default UserAvatar;
