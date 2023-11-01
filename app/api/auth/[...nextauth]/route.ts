import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
          response_type: "code",
        },
      },
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
    session: async ({ session }) => {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      });
      return {
        ...session,
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          role: user?.role,
          groups: user?.groups,
          image: user?.image,
        },
      };
    },
    jwt: async ({ token }) => {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export const getAuthSession = async () => await getServerSession(authOptions);
export { handler as GET, handler as POST };
