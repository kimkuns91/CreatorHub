import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface BookmarkButtonProps {
  postId: string;
  initialIsBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialIsBookmarked,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { data: session } = useSession();

  const handleBookmark = async () => {
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post("/api/bookmarks", { postId });
      if (response.status === 200 || response.status === 201) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("북마크 처리 중 오류:", error);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      className="cursor-pointer group focus:outline-none"
    >
      {isBookmarked ? (
        <RiBookmarkFill className="text-blue-500" />
      ) : (
        <RiBookmarkLine className="hover:text-blue-500 transition duration-300" />
      )}
    </button>
  );
};

export default BookmarkButton;
