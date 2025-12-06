import NextAuth from 'next-auth';
import { authConfig } from '../../auth.config';
import { prisma } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      try {
        // Check if user exists
        let existingUser = await prisma.user.findUnique({
          where: { googleId: account.providerAccountId },
        });

        if (!existingUser) {
          // Create new user
          existingUser = await prisma.user.create({
            data: {
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name || '',
              avatarUrl: user.image || '',
            },
          });
        }

        user.id = existingUser.id;
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
});
