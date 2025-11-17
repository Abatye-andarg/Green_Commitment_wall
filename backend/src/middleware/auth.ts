import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import User, { IUser } from '../models/User';
import Organization from '../models/Organization';

export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware to verify NextAuth JWT token and attach user to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

    // Verify JWT token from NextAuth
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub || !payload.email) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    // Find or create user in database
    let user = await User.findOne({ email: payload.email as string });

    if (!user) {
      // Create user if doesn't exist (first time login)
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || 'User',
        image: payload.picture as string | undefined,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token, but attaches user if present
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ No auth header found in optionalAuth');
      next();
      return;
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

    console.log('🔐 Verifying JWT token in optionalAuth...');
    const { payload } = await jwtVerify(token, secret);
    console.log('✅ JWT verified, payload:', { email: payload.email, sub: payload.sub });

    if (payload.email) {
      const user = await User.findOne({ email: payload.email as string });
      if (user) {
        req.user = user;
        console.log('✅ User attached to request:', user.email);
      } else {
        console.log('⚠️ User not found in database for email:', payload.email);
      }
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    console.error('⚠️ JWT verification failed in optionalAuth:', error);
    next();
  }
};

/**
 * Middleware to check if user is admin of a specific organization
 */
export const requireOrgAdmin = (orgIdParam: string = 'id') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // System admin can access all orgs
      if (req.user.role === 'admin') {
        next();
        return;
      }

      const orgId = req.params[orgIdParam];
      const organization = await Organization.findById(orgId);

      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      const isAdmin = organization.adminUserIds.some(
        id => id.toString() === req.user!._id.toString()
      );

      if (!isAdmin) {
        res.status(403).json({ error: 'Not an admin of this organization' });
        return;
      }

      next();
    } catch (error) {
      console.error('Organization admin check error:', error);
      res.status(500).json({ error: 'Failed to verify organization permissions' });
    }
  };
};

/**
 * Middleware to check if user is a member of a specific organization
 */
export const requireOrgMember = (orgIdParam: string = 'id') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // System admin can access all orgs
      if (req.user.role === 'admin') {
        next();
        return;
      }

      const orgId = req.params[orgIdParam];
      const organization = await Organization.findById(orgId);

      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      const isMember = organization.memberUserIds.some(
        id => id.toString() === req.user!._id.toString()
      );

      if (!isMember) {
        res.status(403).json({ error: 'Not a member of this organization' });
        return;
      }

      next();
    } catch (error) {
      console.error('Organization member check error:', error);
      res.status(500).json({ error: 'Failed to verify organization membership' });
    }
  };
};
