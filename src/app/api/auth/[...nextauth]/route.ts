import NextAuth from 'next-auth';
import auth from '@/lib/auth';

const handler = auth;

export { handler as GET, handler as POST };
