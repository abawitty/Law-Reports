import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      studentId: string;
      fullName: string;
      email: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    studentId: string;
    fullName: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/membership/login",
  },
  providers: [
    Credentials({
      name: "Member ID",
      credentials: {
        studentId: { label: "Student ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const studentId = credentials?.studentId as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!studentId || !password) return null;

        const user = await prisma.user.findUnique({
          where: { studentId: studentId.trim() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          role: user.role,
          studentId: user.studentId,
          fullName: user.fullName,
          email: user.email ?? "",
          name: user.fullName,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
        token.studentId = (user as { studentId: string }).studentId;
        token.fullName = (user as { fullName: string }).fullName;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.studentId = token.studentId;
      session.user.fullName = token.fullName;
      session.user.email = token.email ?? session.user.email;
      return session;
    },
  },
});
