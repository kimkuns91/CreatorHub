import prisma from '@/db'
import { authOptions } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized user' },
      {
        status: 401,
      },
    )
  }
  
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        accounts: true,
      },
    })
    console.log('findUnique data:', data)
    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error) {
    // console.error('Error in GET /api/users:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve user data' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.json()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized user' },
        {
          status: 401,
        },
      )
    }

    const result = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { ...formData },
    })

    return NextResponse.json(result, {
      status: 200,
    })
  } catch (error) {
    console.error('Error in PUT /api/users:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 },
    )
  }
}
