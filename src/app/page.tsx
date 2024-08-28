"use client";

import Feed from "@/components/Feed";
import MakePost from "@/components/MakePost";

export default function Home() {
  return (
    <div className="w-full mx-auto border-r border-l min-h-screen">
      <div className="py-4 px-4 sticky top-0 z-10 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-normal">홈</h2>
      </div>
      <MakePost />
      <Feed />
    </div>
  );
}
