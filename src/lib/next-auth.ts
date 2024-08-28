import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CustomPrismaAdapter from "./CustomPrismaAdapter";

if (
  !process.env.KAKAO_CLIENT_ID ||
  !process.env.KAKAO_CLIENT_SECRET ||
  !process.env.NEXTAUTH_SECRET
) {
  console.error("환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 2,
  },
  adapter: CustomPrismaAdapter,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
      // 중복 이메일 가입 예외처리
      // allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/users/signin",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),

    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};
