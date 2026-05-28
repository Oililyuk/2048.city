import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '../../auth.config';
import { prisma } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: 'Guest Login',
      credentials: {
        username: { label: 'Nickname', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        const username = (credentials.username as string).trim();
        
        // Character count: 2-15 characters. Support Chinese/English/Alphanumeric/Underscore.
        if (username.length < 2 || username.length > 15) {
          return null;
        }
        if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
          return null;
        }

        const googleId = `guest:${username.toLowerCase()}`;
        const email = `guest_${username.toLowerCase()}@2048.city`;

        try {
          let user = await prisma.user.findUnique({
            where: { googleId },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                googleId,
                email,
                name: username,
                avatarUrl: '/default-avatar.png',
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatarUrl,
            googleId: user.googleId,
          };
        } catch (error) {
          console.error('Error in Credentials authorize:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (!account) return false;
      if (account.provider === 'credentials') return true;
      if (!user.email) return false;

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
