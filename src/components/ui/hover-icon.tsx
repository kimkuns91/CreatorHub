import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HoverIconProps {
  icon: ReactNode; // 아이콘 컴포넌트
  textColor?: string; // 텍스트 색상 (선택 사항)
  hoverColor?: string; // 마우스 오버 시 색상 (선택 사항)
  onClick?: () => void; // 클릭 이벤트 핸들러 (선택 사항)
}

const HoverIcon: React.FC<HoverIconProps> = ({
  icon,
  textColor,
  hoverColor,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "cursor-pointer group focus:outline-none hover:text-red-500 transition duration-300",
        textColor,
        hoverColor && "hover:" + hoverColor
      )}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default HoverIcon;
