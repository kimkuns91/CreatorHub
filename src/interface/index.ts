import { Prisma } from "@prisma/client";

export type PostWithUser = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
        name: true;
        username: true;
        image: true;
      };
    };
    _count: {
      select: {
        comments: true;
        likes: true;
      };
    };
    likes: {
      select: {
        userId: true;
      };
    };
    bookmarks: {
      select: {
        userId: true;
      };
    };
  };
}> & {
  isLiked: boolean;
  isBookmarked: boolean;
};

export type UserWithAccount = Prisma.UserGetPayload<{
  include: {
    accounts: true;
  };
}>;

export interface PostFormType {
  title?: string;
  context?: string;
}
