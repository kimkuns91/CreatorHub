import { RiHeartFill, RiHeartLine } from "react-icons/ri";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialIsLiked: boolean;
  onToggle: (liked: boolean) => void; // onToggle 콜백 추가
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialIsLiked, onToggle }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { data: session } = useSession();

  const handleLike = async () => {
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post("/api/likes", { postId });
      if (response.status === 200 || response.status === 201) {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        onToggle(newLikedState); // onToggle 호출하여 부모 컴포넌트에 변경 알림
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
    }
  };

  return (
    <button onClick={handleLike} className="cursor-pointer group focus:outline-none">
      {isLiked ? (
        <RiHeartFill className="text-red-500" />
      ) : (
        <RiHeartLine className="hover:text-red-500 transition duration-300" />
      )}
    </button>
  );
};

export default LikeButton;
