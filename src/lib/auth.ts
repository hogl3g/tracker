import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { db } from './db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Simple dev-friendly credential check using env vars.
        // In production, replace with proper password checks.
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          let user = await db.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            user = await db.user.create({
              data: { email: credentials.email, name: 'Admin', role: 'admin' },
            });
          }
          return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
        }

        // Fallback: try to return user by email (no password check) for convenience in dev.
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (user) return { id: user.id, email: user.email, name: user.name, role: user.role } as any;

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions as any);
