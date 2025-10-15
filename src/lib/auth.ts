import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // ✅ Return all user data including emailVerified
        console.log("User found in DB:", {
          id: user.id,
          email: user.email,
          status: user.status,
          emailVerified: user.emailVerified,
        });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username,
          status: user.status,
          emailVerified: user.emailVerified, // ✅ Make sure this is included
        };
      },
    }),
    
  ],
  callbacks: {
    async jwt({ token, user}) {
      // ✅ When user first signs in, copy user data to token
      if (user) {
        console.log("JWT callback - user object:", user);
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.status = user.status;
        token.emailVerified = !!user.emailVerified; // ✅ Ensure boolean
      }

      // ✅ On every request, refresh user data from database
      // This ensures we always have the latest status and emailVerified
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            username: true,
            status: true,
            emailVerified: true, // ✅ Always fetch latest value
          },
        });

        if (dbUser) {
          console.log("JWT callback - refreshed user from DB:", {
            status: dbUser.status,
            emailVerified: dbUser.emailVerified,
          });
          
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.emailVerified = dbUser.emailVerified; // ✅ Update token with latest value
          token.username = dbUser.username;
        }
      }

      console.log("JWT callback - final token:", {
        id: token.id,
        status: token.status,
        emailVerified: token.emailVerified,
      });

      return token;
    },
    async session({ session, token }) {
      // ✅ Copy all data from token to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.username = token.username as string | null;
        session.user.status = token.status;
        session.user.emailVerified = token.emailVerified as boolean; // ✅ Add to session
        
        console.log("Session callback - final session.user:", {
          id: session.user.id,
          status: session.user.status,
          emailVerified: session.user.emailVerified,
        });
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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};