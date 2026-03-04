import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Simple admin list via env var (comma separated)
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider for simple email/password testing.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";
        const adminPassword = process.env.ADMIN_PASSWORD || "";

        if (!email || !password) return null;

        // Allow login if the email is in admin list and password matches ADMIN_PASSWORD
        if (
          adminEmails.includes(email) &&
          adminPassword &&
          password === adminPassword
        ) {
          return { id: email, name: email, email } as any;
        }

        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add isAdmin flag based on email
      const email = session?.user?.email ?? "";
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: adminEmails.includes(email),
        },
      } as any;
    },
  },
};

export default authOptions;
