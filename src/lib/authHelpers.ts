import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { db } from './db';

export async function requireSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || !session.user?.email) return null;
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  return { session, user } as any;
}

export function hasRole(user: any, roles: string[] = []) {
  if (!user) return false;
  if (!roles || roles.length === 0) return true;
  return roles.includes(user.role);
}
