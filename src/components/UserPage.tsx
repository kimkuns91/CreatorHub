'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaArrowLeft, FaEdit, FaShareAlt } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { UserWithAccount } from '@/interface';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiDotsVertical } from 'react-icons/hi';
import UserMediaList from './UserMediaList';
import UserPostList from './UserPostList';

interface UserPageProps {
  user: UserWithAccount
}

const UserPage: React.FC<UserPageProps> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div
        className="flex items-start justify-between h-44 p-4 bg-cover bg-center text-secondary"
        style={{ backgroundImage: `url(${user.image})` }}
      >
        <div className="flex items-center space-x-4">
          <FaArrowLeft />
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
        <HiDotsVertical className="text-xl cursor-pointer" />
      </div>

      {/* User Info Section */}
      <div
        className={cn(
          'w-full flex flex-col items-start pb-8',
          'shadow-lg shadow-slate-900/20 shadow-b-2 shadow-r-[3px] -shadow-spread-2',
        )}
      >
        <div className="relative px-4 mt-[-44px] mb-4">
          <Avatar className="h-24 w-24 rounded-full ring ring-muted">
            <AvatarImage
              src={user.image || '/images/noUser.webp'}
              alt="profile"
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full flex items-start justify-between px-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
          <div className="flex space-x-4">
            {user.id === session?.user.id && (
              <button className="flex items-center border border-primary space-x-2 px-4 py-2 rounded-full hover:bg-primary hover:text-secondary transition duration-200">
                <FaEdit />
                <span>프로필 편집</span>
              </button>
            )}
            <button className="flex items-center border border-primary space-x-2 px-4 py-2 rounded-full hover:bg-primary hover:text-secondary transition duration-200">
              <FaShareAlt />
              <span>공유</span>
            </button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="posts"
        className={cn(
          'w-full mt-4',
          'shadow-lg shadow-slate-900/20',
          'shadow-r-[3px] -shadow-spread-2',
        )}
        style={{
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TabsList>
          <TabsTrigger value="posts" className="flex-1 py-4">
            게시물
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 py-4">
            미디어
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <UserPostList userId={user.id} />
        </TabsContent>
        <TabsContent value="media">
          <UserMediaList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPage;
