import {
  HiOutlineBellAlert,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineUserCircle
} from "react-icons/hi2";

export const links = [
  {
    icon: <HiOutlineHome className="w-7 h-7" />,
    name: "홈",
    path: "/",
  },
  {
    icon: <HiOutlineBellAlert className="w-7 h-7" />,
    name: "알림",
    path: "/my/notifications",
  },
  {
    icon: <HiOutlineChatBubbleBottomCenterText className="w-7 h-7" />,
    name: "메세지",
    path: "/my/chats",
  },
  {
    icon: <HiOutlineHeart className="w-7 h-7" />,
    name: "구독",
    path: "/my/collections",
  },
  {
    icon: <HiOutlineUserCircle className="w-7 h-7" />,
    name: "내 프로필",
    path: "/my/works",
  },
];
