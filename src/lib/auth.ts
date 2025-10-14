// Update: src/lib/auth.ts
import { AuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (user.status === "BANNED") {
          throw new Error("Account has been banned");
        }

        // ✅ Return user object with custom fields including username
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          username: user.username, // ✅ Add username
          image: user.image,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // ✅ For OAuth users, only allow sign in if they already have an account
      // New users must sign up through the registration form to set their username
      if (!existingUser && account?.provider === "google") {
        // Redirect to signup page with a message
        return "/signup?error=OAuthAccountNotFound";
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // ✅ Add custom fields to token on initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username; // ✅ Add username to token
        token.role = user.role;
        token.status = user.status;
      }

      // ✅ Handle session updates
      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.role) token.role = session.role;
        if (session.status) token.status = session.status;
      }

      return token;
    },
    async session({ session, token }) {
      // ✅ Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username; // ✅ Add username to session
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};