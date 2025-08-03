import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; 
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(prisma),
session: {
    strategy: "jwt"
},
pages: {
    signIn: "/login",
},
providers: [
  CredentialsProvider({
    // The name to display on the sign-in form (e.g. "Sign in with...")
    name: "Credentials",

    // The `credentials` object is used to generate a form on the sign-in page.
    credentials: {
      email: { label: "email", type: "email", placeholder: "johndoe@mail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {

        if(!credentials?.email || !credentials?.password) {
                return null
        }
      
        try {
            
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: credentials?.email
                }
            });

            if(!existingUser) {
                return null;
            }

            const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password)

            if(!passwordMatch) {
                return null;
            }

            // Check if user account is active
            if (existingUser.status !== 'ACTIVE') {
                console.log("User account is not active:", existingUser.email);
                return null;
            }

            return {
                id: existingUser.id.toString(),
                username: existingUser.username,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role
            }
        } catch (error) {
            console.log("Auth error:", error);
            return null;
        }
    
    }
  })
],

  callbacks: {
    // JWT callback - runs whenever a JWT is created
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.userId = user.id;
      }
      return token;
    },
    
    // Session callback - runs whenever a session is checked
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;

        // 🔥 CREATE CUSTOM SESSION HERE AFTER SUCCESSFUL LOGIN
        try {
          await createSession(
            session.user.id,
            session.user.email!,
            session.user.role,
            session.user.username || undefined
          );
          
          console.log(`Custom session created for user: ${session.user.email} with role: ${session.user.role}`);
        } catch (error) {
          console.error("Failed to create custom session:", error);
          // Don't throw error here as it would break NextAuth session
        }
      }
      return session;
    },

    // Redirect callback - controls where users go after sign in
    async redirect({ url, baseUrl }) {
      // If url is relative, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default redirect based on role will be handled in the login form
      return baseUrl;
    }
  },
  
  // Events - useful for logging
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email} with role: ${user.role}`);
      
      // Additional logging based on role
      if (user.role === 'ADMIN') {
        console.log(`Admin user ${user.email} signed in`);
      } else if (user.role === 'USER') {
        console.log(`Regular user ${user.email} signed in`);
      }
    },
    
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || 'Unknown'}`);
    }
  }

};

