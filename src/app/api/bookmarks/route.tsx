import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        error: "unauthorized user",
      },
      { status: 401 }
    );
  }

  const formData = await req.json();
  const { postId } = formData;

  try {
    let bookmark = await prisma.bookmark.findFirst({
      where: {
        postId,
        userId: session?.user?.id,
      },
    });

    if (bookmark) {
      // 이미 북마크가 존재하는 경우, 삭제하기
      bookmark = await prisma.bookmark.delete({
        where: {
          id: bookmark.id,
        },
      });

      return NextResponse.json(bookmark, {
        status: 200,
      });
    } else {
      // 북마크가 없는 경우, 생성하기
      bookmark = await prisma.bookmark.create({
        data: {
          postId,
          userId: session?.user?.id,
        },
      });

      return NextResponse.json(bookmark, {
        status: 201,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("북마크 처리 중 오류:", error.message);
      return NextResponse.json(
        { error: "Failed to process bookmark", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("알 수 없는 오류:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
