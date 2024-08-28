// src/adapters/CustomPrismaAdapter.ts

import { AdapterAccount, AdapterUser } from "next-auth/adapters";

import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db";

const CustomPrismaAdapter: Adapter = {
  ...PrismaAdapter(prisma),

  async createUser(profile: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    let username;
    let isUnique = false;

    while (!isUnique) {
      const randomNum = Math.floor(100000000 + Math.random() * 900000000);
      username = `u${randomNum}`;
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        ...profile,
        username,
        email: profile.email || "",
        name: profile.name || "",
        image: profile.image || "",
      },
    });

    return {
      id: user.id,
      email: user.email || "",
      name: user.name || "",
      image: user.image || "",
      emailVerified: user.emailVerified,
      username: user.username || "",
    } as AdapterUser;
  },

  async linkAccount(account: AdapterAccount): Promise<void> {
    await prisma.account.create({
      data: {
        ...account,
        token_type: account.token_type?.toLowerCase() as
          | Lowercase<string>
          | undefined,
      },
    });
  },

  async unlinkAccount(
    account: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Promise<void> {
    await prisma.account.deleteMany({
      where: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
    });
  },
};

export default CustomPrismaAdapter;
