import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { SignJWT, jwtVerify } from 'jose';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch user data from backend
async function fetchUserFromBackend(email: string, name?: string, picture?: string) {
  try {
    const secretEnv = process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;
    if (!secretEnv) {
      console.error('NEXTAUTH_SECRET is not defined');
      return null;
    }

    const secret = new TextEncoder().encode(secretEnv);
    const token = await new SignJWT({
      sub: email,
      email,
      name,
      picture
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data?.user || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user from backend:', error);
    return null;
  }
}

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
        
        // Fetch user data from backend to get role and organizationId
        const backendUser = await fetchUserFromBackend(
          token.email as string,
          token.name as string,
          token.picture as string
        );
        
        if (backendUser) {
          token.userId = backendUser._id;
          token.role = backendUser.role;
          token.organizationId = backendUser.organizationId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId || token.sub || '';
        (session.user as any)._id = token.userId || token.sub || '';
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.image = (token.picture as string) || '';
        (session.user as any).role = token.role || 'user';
        (session.user as any).organizationId = token.organizationId || null;
      }
      // Create accessToken from session data for backend authentication
      session.accessToken = JSON.stringify({
        sub: token.userId || token.sub,
        email: token.email,
        name: token.name,
        picture: token.picture,
        role: token.role,
        organizationId: token.organizationId
      });
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
});
