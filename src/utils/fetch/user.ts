'use server';

import prisma from '@/db';

export const useGetUser = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};
