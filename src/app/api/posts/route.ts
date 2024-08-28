import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/db'
import { authOptions } from '@/lib/next-auth'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const page = searchParams.get('page') as string
  const limit = (searchParams.get('limit') as string) || '10'

  const session = await getServerSession(authOptions)

  try {
    if (page) {
      const count = await prisma.post.count()
      const skipPage = parseInt(page) - 1
      const posts = await prisma.post.findMany({
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
              userId: session?.user.id, // 현재 사용자의 좋아요 여부를 확인
            },
            select: {
              userId: true,
            },
          },
          bookmarks: {
            where: {
              userId: session?.user.id, // 현재 사용자의 북마크 여부를 확인
            },
            select: {
              userId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: skipPage * parseInt(limit),
      })

      const formattedPosts = posts.map((post) => ({
        ...post,
        isLiked: post.likes.some((like) => like.userId === session?.user.id), // 사용자가 좋아요를 눌렀는지 여부 확인
        isBookmarked: post.bookmarks.some(
          (bookmark) => bookmark.userId === session?.user.id,
        ), // 사용자가 북마크를 했는지 여부 확인
      }))

      return NextResponse.json(
        {
          page: parseInt(page),
          data: formattedPosts,
          totalCount: count,
          totalPage: Math.ceil(count / parseInt(limit)),
        },
        { status: 200 },
      )
    } else {
      const data = await prisma.post.findMany({
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
              userId: session?.user.id, // 현재 사용자의 좋아요 여부를 확인
            },
            select: {
              userId: true,
            },
          },
          bookmarks: {
            where: {
              userId: session?.user.id, // 현재 사용자의 북마크 여부를 확인
            },
            select: {
              userId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(data, {
        status: 200,
      })
    }
  } catch (error) {
    // 에러가 Error 인스턴스인지 확인하고 처리
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma 클라이언트 오류:', error.message)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 },
      )
    } else if (error instanceof Error) {
      console.error('게시물 불러오기 중 오류:', error.message)
      return NextResponse.json(
        { error: 'Failed to get post', details: error.message },
        { status: 500 },
      )
    } else {
      console.error('알 수 없는 오류:', error)
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 },
      )
    }
  }
}

export async function POST(req: NextRequest) {
  // 사용자가 인증되었는지 확인하기 위해 세션 가져오기
  const session = await getServerSession(authOptions)

  // 세션이 없거나 인증되지 않은 사용자인 경우, 권한 없음 응답 반환
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized user' }, { status: 401 })
  }

  try {
    // 요청에서 form 데이터 파싱하기
    const { content, images, imageKeys, videos, videoKeys } = await req.json()

    if (
      !content ||
      images.length !== imageKeys.length ||
      videos.length !== videoKeys.length
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }

    // PostType 결정
    const postType = images.length > 0 || videos.length > 0 ? 'media' : 'text'

    const result = await prisma.post.create({
      data: {
        content: content,
        userId: session.user.id,
        images: images, // 이미지 URL 저장
        imageKeys: imageKeys, // 이미지 키 저장
        videos: videos, // 비디오 URL 저장
        videoKeys: videoKeys, // 비디오 키 저장
        type: postType, // 자동 결정된 게시물 타입 저장
      },
    })

    // 생성된 게시물 데이터를 응답으로 반환
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    // 에러가 Error 인스턴스인지 확인하고 처리
    if (error instanceof Error) {
      console.error('게시물 생성 중 오류:', error.message)
      // 오류 메시지를 포함하여 서버 오류 응답 반환
      return NextResponse.json(
        { error: 'Failed to create post', details: error.message },
        { status: 500 },
      )
    } else {
      // 에러가 Error 인스턴스가 아닌 경우
      console.error('알 수 없는 오류:', error)
      // 일반적인 서버 오류 응답 반환
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 },
      )
    }
  }
}
