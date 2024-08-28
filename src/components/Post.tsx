import { FaAngleLeft, FaAngleRight, FaPlus, FaTimes } from 'react-icons/fa';

import { PostWithUser } from '@/interface';
import { dateFormat } from '@/lib/dateFormat';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { RiChat3Line } from 'react-icons/ri';
import BookmarkButton from './BookMarkButton';
import LikeButton from './LikeButton';
import HoverIcon from './ui/hover-icon';
import UserAvatar from './UserAvatar';

interface PostProps {
  post: PostWithUser
}

const Post: React.FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 좋아요 수와 상태를 관리하는 state 추가
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);

  // 모달을 열고 첫 번째 이미지를 표시
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 이전 이미지로 이동
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post.images.length - 1,
    );
  };

  // 다음 이미지로 이동
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post.images.length - 1 ? prevIndex + 1 : 0,
    );
  };

  return (
    <div className="flex flex-col p-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserAvatar image={post.user.image ?? ''} />
          <div className="flex flex-col whitespace-nowrap">
            <h4
              className="font-bold text-base truncate cursor-pointer"
              onClick={() => {
                router.push('/' + post.user.username);
              }}
            >
              {post.user.name}
            </h4>
            <span
              className="text-sm text-gray-500 truncate cursor-pointer"
              onClick={() => {
                router.push('/' + post.user.username);
              }}
            >
              @{post.user.username}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-500">{dateFormat(post.createdAt)}</p>
          <HiDotsHorizontal className="text-xl" />
        </div>
      </div>
      <div className="flex-1 py-2">
        <p className="text-gray-800 text-base my-3">{post.content}</p>
        {/* 이미지 표시 */}
        {post.images && post.images.length > 0 && (
          <div className="relative mt-2">
            {/* 첫 번째 이미지만 표시 */}
            <Image
              src={post.images[0]}
              alt="Post image"
              layout="responsive"
              width={800}
              height={800}
              objectFit="cover"
              className="rounded-md cursor-pointer"
              onClick={() => openModal(0)}
            />

            {/* 여러 장의 이미지가 있을 경우 "더보기" 아이콘 추가 */}
            {post.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs rounded-full p-1 flex items-center justify-center">
                <FaPlus className="mr-1" />
                {post.images.length}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full py-2 flex justify-between items-center text-2xl">
        <div className="flex items-center space-x-3">
          {/* LikeButton 컴포넌트에 상태 관리 함수 전달 */}
          <LikeButton
            postId={post.id}
            initialIsLiked={isLiked}
            onToggle={(liked) => {
              setIsLiked(liked);
              setLikesCount((prevCount) =>
                liked ? prevCount + 1 : prevCount - 1,
              );
            }}
          />
          <HoverIcon
            icon={<RiChat3Line />}
            onClick={() => {
              router.push('/' + post.user.username + '/' + post.id);
            }}
          />
          {/* <HoverIcon icon={<RiMoneyDollarCircleLine />} /> */}
        </div>
        <BookmarkButton
          postId={post.id}
          initialIsBookmarked={post.isBookmarked}
        />
      </div>
      {/* 업데이트된 좋아요 수 표시 */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>좋아요 {likesCount}</span>
        <span>·</span>
        <Link
          href={'/' + post.id}
          className="hover:text-blue-500 transition duration-200"
        >
          댓글 {post._count.comments}
        </Link>
      </div>
      {/* 모달 창 */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="relative">
            <button
              className="absolute top-0 right-0 p-8 text-white text-xl hover:scale-125 transition duration-200"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            <Image
              src={post.images[currentImageIndex]}
              alt="Selected post image"
              width={800}
              height={800}
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          {/* 여러 장일 때만 화살표 표시 */}
          {post.images.length > 1 && (
            <>
              <button
                className="absolute left-2 p-8 top-1/2 transform -translate-y-1/2 text-white text-xl hover:scale-125 transition duration-200"
                onClick={prevImage}
              >
                <FaAngleLeft />
              </button>
              <button
                className="absolute right-2 p-8 top-1/2 transform -translate-y-1/2 text-white text-xl hover:scale-125 transition duration-200"
                onClick={nextImage}
              >
                <FaAngleRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
