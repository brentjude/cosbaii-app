// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Existing Credentials Provider
    CredentialsProvider({
      name: "credentials",
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

        const isValidPassword = await compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      
      // Handle Google sign-in
      if (account?.provider === "google" && user) {
        // Find or create user in database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = String(dbUser.id);
          token.role = dbUser.role;
          token.username = dbUser.username;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for Google sign-in
            const username = await generateUniqueUsername(user.name!, user.email!);

            const newUser = await prisma.user.create({
              data: {
              name: user.name!,
              email: user.email!,
              image: user.image,
              username: username, // ✅ Add username
              emailVerified: new Date(),
              role: "USER",
              status: "ACTIVE",
              password: null, // ✅ Explicitly set as null for OAuth users
            },
            });

             // Create default profile
              await prisma.profile.create({
                data: {
                  userId: newUser.id,
                  displayName: user.name!,
                  profilePicture: user.image || "/images/default-avatar.png",
                },
              });


            // Trigger badge check for new user
            try {
              const { BadgeTriggers } = await import('@/lib/badgeTriggers');
              await BadgeTriggers.onUserRegistration(newUser.id);
            } catch (badgeError) {
              console.error('Error triggering badges for Google user:', badgeError);
            }
          }
          
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

// Add this function at the top of your auth.ts file
async function generateUniqueUsername(name: string, email: string): Promise<string> {
  // Start with the name, remove spaces and special characters
  let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // If empty, use part of email
  if (!baseUsername) {
    baseUsername = email.split('@')[0].replace(/[^a-z0-9]/g, '');
  }
  
  // Check if username exists
  const existingUser = await prisma.user.findUnique({
    where: { username: baseUsername }
  });
  
  if (!existingUser) {
    return baseUsername;
  }
  
  // If exists, add numbers until unique
  let counter = 1;
  let newUsername = `${baseUsername}${counter}`;
  
  while (await prisma.user.findUnique({ where: { username: newUsername } })) {
    counter++;
    newUsername = `${baseUsername}${counter}`;
  }
  
  return newUsername;
}