import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/db';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const userId = params.userId;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as string;
  const session = await getServerSession(authOptions);

  try {
    // 기본적으로 모든 게시물 가져오기
    let whereClause: any = { userId }; // any 타입 사용

    // type 값에 따른 필터링
    if (type === 'post') {
      whereClause.type = 'text'; // 텍스트 게시물만
    } else if (type === 'media') {
      whereClause.type = 'media'; // 미디어 게시물만
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          where: {
            userId: session?.user.id,
          },
          select: {
            userId: true,
          },
        },
        bookmarks: {
          where: {
            userId: session?.user.id,
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      isLiked: post.likes.some((like) => like.userId === session?.user.id),
      isBookmarked: post.bookmarks.some(
        (bookmark) => bookmark.userId === session?.user.id,
      ),
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('게시물 불러오기 중 오류:', error.message);
      return NextResponse.json(
        { error: 'Failed to get post', details: error.message },
        { status: 500 },
      );
    } else {
      console.error('알 수 없는 오류:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 },
      );
    }
  }
}
