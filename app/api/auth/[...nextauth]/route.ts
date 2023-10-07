import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "sign in",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) return null;

        if (!user.password) return null;
        const validPassword = await compare(
          credentials?.password,
          user.password
        );

        if (!validPassword) return null;

        return { ...user };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (!token.email) return session;
      const user = await prisma.user.findUnique({
        where: { email: token.email },
        select: { email: true, image: true, name: true, role: true },
      });
      session.user.email = user?.email as Role;
      session.user.image = user?.image as Role;
      session.user.name = user?.name as Role;
      session.user.role = user?.role as Role;

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          user: { ...user },
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export const getAuthSession = async () => await getServerSession(authOptions);
export { handler as GET, handler as POST };
