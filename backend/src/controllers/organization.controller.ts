import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Organization from '../models/Organization';
import User from '../models/User';
import Commitment from '../models/Commitment';
import Challenge from '../models/Challenge';
import ProgressUpdate from '../models/ProgressUpdate';
import JoinRequest from '../models/JoinRequest';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Create a new organization
 * POST /api/organizations
 */
export async function createOrganization(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { name, type, description, logo, settings } = req.body;
    const userId = req.user._id;

    // Validation
    if (!name || !type) {
      throw new AppError('Name and type are required', 400);
    }

    const validTypes = ['company', 'ngo', 'school', 'government', 'other'];
    if (!validTypes.includes(type)) {
      throw new AppError('Invalid organization type', 400);
    }

    // Check if user already belongs to an organization
    const user = await User.findById(userId);
    if (user?.organizationId) {
      throw new AppError('User already belongs to an organization', 400);
    }

    // Create organization with the creator as admin and member
    const organization = await Organization.create({
      name,
      type,
      description,
      logo,
      adminUserIds: [userId],
      memberUserIds: [userId],
      settings: settings || {},
      totalOrgCarbonSaved: 0,
    });

    // Update user to be org_admin and link to organization
    await User.findByIdAndUpdate(userId, {
      role: 'org_admin',
      organizationId: organization._id,
    });

    res.status(201).json({
      status: 'success',
      data: { organization },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Create organization error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create organization',
      });
    }
  }
}

/**
 * Get organization by ID
 * GET /api/organizations/:id
 */
export async function getOrganization(req: AuthRequest, res: Response): Promise<void> {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('adminUserIds', 'name email image')
      .populate('memberUserIds', 'name email image totalCarbonSaved level');

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    res.json({
      status: 'success',
      data: { organization },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Get organization error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organization',
      });
    }
  }
}

/**
 * Update organization
 * PATCH /api/organizations/:id
 */
export async function updateOrganization(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, type, description, logo, settings } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (type) {
      const validTypes = ['company', 'ngo', 'school', 'government', 'other'];
      if (!validTypes.includes(type)) {
        throw new AppError('Invalid organization type', 400);
      }
      updateData.type = type;
    }
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (settings) updateData.settings = settings;

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    res.json({
      status: 'success',
      data: { organization },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Update organization error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update organization',
      });
    }
  }
}

/**
 * Delete organization
 * DELETE /api/organizations/:id
 */
export async function deleteOrganization(req: AuthRequest, res: Response): Promise<void> {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Remove organization reference from all members
    await User.updateMany(
      { _id: { $in: organization.memberUserIds } },
      { 
        $unset: { organizationId: '' },
        role: 'user' // Reset role to user
      }
    );

    // Delete the organization
    await Organization.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Delete organization error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete organization',
      });
    }
  }
}

/**
 * List all organizations
 * GET /api/organizations
 */
export async function listOrganizations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const query: any = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Organization.countDocuments(query);
    const organizations = await Organization.find(query)
      .select('name type description logo totalOrgCarbonSaved memberUserIds createdAt')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Add member count to each org
    const orgsWithCount = organizations.map(org => ({
      ...org.toObject(),
      memberCount: org.memberUserIds.length,
    }));

    res.json({
      status: 'success',
      data: {
        organizations: orgsWithCount,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('List organizations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch organizations',
    });
  }
}

/**
 * Add member to organization
 * POST /api/organizations/:id/members
 */
export async function addMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userId, makeAdmin = false } = req.body;

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user already belongs to an organization
    if (user.organizationId) {
      throw new AppError('User already belongs to an organization', 400);
    }

    // Check if already a member
    if (organization.memberUserIds.some(id => id.toString() === userId)) {
      throw new AppError('User is already a member', 400);
    }

    // Add to members
    organization.memberUserIds.push(new mongoose.Types.ObjectId(userId));
    
    // Add to admins if requested
    if (makeAdmin) {
      organization.adminUserIds.push(new mongoose.Types.ObjectId(userId));
    }

    await organization.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      organizationId: organization._id,
      ...(makeAdmin && { role: 'org_admin' }),
    });

    res.json({
      status: 'success',
      message: 'Member added successfully',
      data: { organization },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Add member error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add member',
      });
    }
  }
}

/**
 * Remove member from organization
 * DELETE /api/organizations/:id/members/:userId
 */
export async function removeMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Cannot remove if only admin
    const isAdmin = organization.adminUserIds.some(id => id.toString() === userId);
    if (isAdmin && organization.adminUserIds.length === 1) {
      throw new AppError('Cannot remove the last admin', 400);
    }

    // Remove from members and admins
    organization.memberUserIds = organization.memberUserIds.filter(
      id => id.toString() !== userId
    );
    organization.adminUserIds = organization.adminUserIds.filter(
      id => id.toString() !== userId
    );

    await organization.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      $unset: { organizationId: '' },
      role: 'user',
    });

    res.json({
      status: 'success',
      message: 'Member removed successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Remove member error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to remove member',
      });
    }
  }
}

/**
 * Toggle admin status for a member
 * PATCH /api/organizations/:id/members/:userId/admin
 */
export async function toggleAdmin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Check if user is a member
    if (!organization.memberUserIds.some(id => id.toString() === userId)) {
      throw new AppError('User is not a member of this organization', 400);
    }

    const isAdmin = organization.adminUserIds.some(id => id.toString() === userId);

    if (isAdmin) {
      // Remove admin (demote)
      if (organization.adminUserIds.length === 1) {
        throw new AppError('Cannot remove the last admin', 400);
      }
      organization.adminUserIds = organization.adminUserIds.filter(
        id => id.toString() !== userId
      );
      await User.findByIdAndUpdate(userId, { role: 'user' });
    } else {
      // Add admin (promote)
      organization.adminUserIds.push(new mongoose.Types.ObjectId(userId));
      await User.findByIdAndUpdate(userId, { role: 'org_admin' });
    }

    await organization.save();

    res.json({
      status: 'success',
      message: isAdmin ? 'Admin removed successfully' : 'Admin added successfully',
      data: { isAdmin: !isAdmin },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Toggle admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update admin status',
      });
    }
  }
}

/**
 * Get organization members with pagination
 * GET /api/organizations/:id/members
 */
export async function getMembers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { page = 1, limit = 20, search, sortBy = 'carbonSaved' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Build query
    const query: any = { _id: { $in: organization.memberUserIds } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Determine sort
    let sort: any = {};
    if (sortBy === 'carbonSaved') sort = { totalCarbonSaved: -1 };
    else if (sortBy === 'level') sort = { level: -1 };
    else if (sortBy === 'commitments') sort = { totalCommitments: -1 };
    else sort = { name: 1 };

    const total = await User.countDocuments(query);
    const members = await User.find(query)
      .select('name email image totalCarbonSaved totalCommitments completedMilestones level role badges')
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Add isAdmin flag
    const membersWithAdminStatus = members.map(member => ({
      ...member,
      isAdmin: organization.adminUserIds.some(id => id.toString() === member._id.toString()),
    }));

    res.json({
      status: 'success',
      data: {
        members: membersWithAdminStatus,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Get members error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch members',
      });
    }
  }
}

/**
 * Get organization dashboard with comprehensive stats
 * GET /api/organizations/:id/dashboard
 */
export async function getOrganizationDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string);
    }

    // Aggregate commitment stats
    const commitmentStats = await Commitment.aggregate([
      { 
        $match: { 
          userId: { $in: organization.memberUserIds },
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: null,
          totalCommitments: { $sum: 1 },
          activeCommitments: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          completedCommitments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          totalCarbonSaved: { $sum: '$actualCarbonSaved' },
          estimatedCarbonSavings: { $sum: '$estimatedCarbonSavings.total' },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await Commitment.aggregate([
      { 
        $match: { 
          userId: { $in: organization.memberUserIds },
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          carbonSaved: { $sum: '$actualCarbonSaved' },
        },
      },
      { $sort: { carbonSaved: -1 } },
    ]);

    // Carbon trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const carbonTrend = await ProgressUpdate.aggregate([
      {
        $match: {
          userId: { $in: organization.memberUserIds },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          carbonSaved: { $sum: '$deltaCarbonSaved' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top contributors
    const topContributors = await User.find({ 
      _id: { $in: organization.memberUserIds } 
    })
      .select('name image totalCarbonSaved totalCommitments level')
      .sort({ totalCarbonSaved: -1 })
      .limit(10);

    // Active challenges
    const activeChallenges = await Challenge.find({
      createdByOrgId: organization._id,
      status: 'active',
    }).countDocuments();

    // Participation rate
    const memberCount = organization.memberUserIds.length;
    const activeMembers = await User.countDocuments({
      _id: { $in: organization.memberUserIds },
      totalCommitments: { $gt: 0 },
    });
    const participationRate = memberCount > 0 ? (activeMembers / memberCount) * 100 : 0;

    const stats = commitmentStats[0] || {
      totalCommitments: 0,
      activeCommitments: 0,
      completedCommitments: 0,
      totalCarbonSaved: 0,
      estimatedCarbonSavings: 0,
    };

    res.json({
      status: 'success',
      data: {
        organization,
        stats: {
          ...stats,
          memberCount,
          activeMembers,
          participationRate: Math.round(participationRate * 10) / 10,
          activeChallenges,
        },
        categoryBreakdown,
        carbonTrend,
        topContributors,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Get organization dashboard error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organization dashboard',
      });
    }
  }
}

/**
 * Get organization challenges
 * GET /api/organizations/:id/challenges
 */
export async function getOrganizationChallenges(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status = 'active', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const query: any = { createdByOrgId: req.params.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await Challenge.countDocuments(query);
    const challenges = await Challenge.find(query)
      .populate('createdByUserId', 'name image')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      status: 'success',
      data: {
        challenges,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Get organization challenges error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch challenges',
    });
  }
}

/**
 * Create a join request for an organization
 * POST /api/organizations/:id/join-request
 */
export async function createJoinRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { message } = req.body;
    const userId = req.user._id;
    const organizationId = req.params.id;

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Check if user already belongs to an organization
    const user = await User.findById(userId);
    if (user?.organizationId) {
      throw new AppError('You already belong to an organization', 400);
    }

    // Check if user already has a pending request for this org
    const existingRequest = await JoinRequest.findOne({
      userId,
      organizationId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new AppError('You already have a pending request for this organization', 400);
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      userId,
      organizationId,
      message,
      status: 'pending',
    });

    res.status(201).json({
      status: 'success',
      data: { joinRequest },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Create join request error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create join request',
      });
    }
  }
}

/**
 * Get join requests for an organization (admin only)
 * GET /api/organizations/:id/join-requests
 */
export async function getJoinRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status = 'pending' } = req.query;
    const organizationId = req.params.id;

    const query: any = { organizationId };
    if (status) query.status = status;

    const joinRequests = await JoinRequest.find(query)
      .populate('userId', 'name email image')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { joinRequests },
    });
  } catch (error) {
    console.error('Get join requests error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch join requests',
    });
  }
}

/**
 * Review a join request (approve/reject) - admin only
 * PATCH /api/organizations/:id/join-requests/:requestId
 */
export async function reviewJoinRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { action } = req.body; // 'approve' or 'reject'
    const { id: organizationId, requestId } = req.params;

    if (!['approve', 'reject'].includes(action)) {
      throw new AppError('Invalid action. Must be approve or reject', 400);
    }

    const joinRequest = await JoinRequest.findOne({
      _id: requestId,
      organizationId,
      status: 'pending',
    });

    if (!joinRequest) {
      throw new AppError('Join request not found or already processed', 404);
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    if (action === 'approve') {
      // Add user to organization
      if (!organization.memberUserIds.includes(joinRequest.userId)) {
        organization.memberUserIds.push(joinRequest.userId);
        await organization.save();
      }

      // Update user
      await User.findByIdAndUpdate(joinRequest.userId, {
        organizationId: organization._id,
        role: 'org_member',
      });

      joinRequest.status = 'approved';
    } else {
      joinRequest.status = 'rejected';
    }

    joinRequest.reviewedBy = req.user._id as mongoose.Types.ObjectId;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save();

    res.json({
      status: 'success',
      data: { joinRequest },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.error('Review join request error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to review join request',
      });
    }
  }
}

/**
 * Get user's join requests
 * GET /api/organizations/my-requests
 */
export async function getMyJoinRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const joinRequests = await JoinRequest.find({ userId: req.user._id })
      .populate('organizationId', 'name type logo')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { joinRequests },
    });
  } catch (error) {
    console.error('Get my join requests error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch join requests',
    });
  }
}
