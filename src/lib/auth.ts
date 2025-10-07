// Update: src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

// ✅ Move this function to the top, before authOptions
async function generateUniqueUsername(name: string, email: string): Promise<string> {
  // Start with name, fallback to email prefix
  let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 
                    email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Ensure it's at least 3 characters
  if (baseUsername.length < 3) {
    baseUsername = 'user' + baseUsername;
  }
  
  // Ensure it's not longer than 20 characters
  baseUsername = baseUsername.substring(0, 17);
  
  // Check if username exists
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existingUser) {
      break;
    }
    
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Ensure we don't exceed 20 characters
    if (username.length > 20) {
      baseUsername = baseUsername.substring(0, 17 - counter.toString().length);
      username = `${baseUsername}${counter}`;
    }
  }
  
  return username;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
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
      
      // Handle Google sign-in JWT token properly
      if (account?.provider === "google" && user) {
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
    // ✅ Simplified redirect callback
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);
      
      // Redirect new users to dashboard
      if (url.includes("/dashboard")) {
        return `${baseUrl}/dashboard`;
      }
      
      if (url === baseUrl || url === `${baseUrl}/login` || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }

      // If url starts with /, it's a relative path
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If it's an absolute URL on the same domain, allow it
      try {
        if (new URL(url).origin === baseUrl) {
          return url;
        }
      } catch {
        // Invalid URL, fallback to dashboard
      }
      
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account }) { // ✅ Removed unused 'profile' parameter
      console.log("SignIn callback - provider:", account?.provider, "email:", user.email);
      
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            console.log("Creating new Google user");
            const username = await generateUniqueUsername(user.name!, user.email!);

            const newUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                username: username,
                emailVerified: new Date(),
                role: "USER",
                status: "ACTIVE",
                password: null,
              },
            });

            // Create default profile
            console.log("New Google user created:", newUser.id);

            // ✅ Send welcome email for Google users
            try {
              console.log("Attempting to send welcome email to:", newUser.email);
              
              const { sendWelcomeEmail } = await import('@/lib/email');
              const emailResult = await sendWelcomeEmail(newUser.email, newUser.name || 'Cosplayer');
              
              if (emailResult.success) {
                console.log('✅ Welcome email sent successfully to Google user:', newUser.email);
              } else {
                console.error('❌ Failed to send welcome email:', emailResult.error);
              }
            } catch (emailError) {
              console.error('❌ Error importing or calling sendWelcomeEmail:', emailError);
            }

            // Trigger badge check
            try {
              const { BadgeTriggers } = await import('@/lib/badgeTriggers');
              await BadgeTriggers.onUserRegistration(newUser.id);
            } catch (badgeError) {
              console.error('Error triggering badges for Google user:', badgeError);
            }
          } else {
            console.log("Existing Google user found:", existingUser.email);

            // ✅ Check if user has existing password - if so, require account linking
            if (existingUser.password) {
              console.log("User has existing password, account linking required");
              // This will trigger the OAuthAccountNotLinked error
              return false;
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
  debug: process.env.NODE_ENV === "development", // ✅ Add debug logging
};