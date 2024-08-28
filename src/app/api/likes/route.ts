import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  // 사용자가 인증되었는지 확인하기 위해 세션 가져오기
  const session = await getServerSession(authOptions);

  // 세션이 없거나 인증되지 않은 사용자인 경우, 권한 없음 응답 반환
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
    let like = await prisma.like.findFirst({
      where: {
        postId,
        userId: session?.user?.id,
      },
    });

    if (like) {
      // 이미 찜을 한 상황이므로, 삭제하기
      like = await prisma.like.delete({
        where: {
          id: like.id,
        },
      });

      return NextResponse.json(like, {
        status: 200,
      });
    } else {
      // 찜을 하지 않았으므로, 생성하기
      like = await prisma.like.create({
        data: {
          postId,
          userId: session?.user?.id,
        },
      });

      return NextResponse.json(like, {
        status: 201,
      });
    }
  } catch (error) {
    // 에러가 Error 인스턴스인지 확인하고 처리
    if (error instanceof Error) {
      console.error("게시물 생성 중 오류:", error.message);
      // 오류 메시지를 포함하여 서버 오류 응답 반환
      return NextResponse.json(
        { error: "Failed to create post", details: error.message },
        { status: 500 }
      );
    } else {
      // 에러가 Error 인스턴스가 아닌 경우
      console.error("알 수 없는 오류:", error);
      // 일반적인 서버 오류 응답 반환
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
