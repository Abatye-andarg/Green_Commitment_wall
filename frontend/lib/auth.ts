import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (account && profile) {
        token.sub = profile.sub || user?.id;
        token.email = profile.email || user?.email;
        token.name = profile.name || user?.name;
        token.picture = (profile as any).picture || user?.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.image = (token.picture as string) || '';
      }
      // Create accessToken from session data for backend authentication
      session.accessToken = JSON.stringify({
        sub: token.sub,
        email: token.email,
        name: token.name,
        picture: token.picture
      });
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
});
