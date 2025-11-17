import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';
import Challenge from '../models/Challenge';
import Organization from '../models/Organization';
import Flag from '../models/Flag';
import Commitment from '../models/Commitment';
import Comment from '../models/Comment';
import { AppError } from '../middleware/errorHandler';
import { notifyChallenge } from '../services/notification.service';

/**
 * Get user notifications
 */
export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { unreadOnly = 'false', limit = '50' } = req.query;
    const query: any = { userId: req.user._id };

    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    res.json({
      status: 'success',
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch notifications', 500);
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    res.json({
      status: 'success',
      data: { notification },
    });
  } catch (error) {
    throw new AppError('Failed to mark notification as read', 500);
  }
}

/**
 * Create a challenge
 */
export async function createChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { title, description, startDate, endDate, targetCarbonSavings, visibility } = req.body;

    const challenge = await Challenge.create({
      createdByUserId: req.user._id,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      targetCarbonSavings,
      visibility: visibility || 'public',
      participantIds: [req.user._id],
    });

    res.status(201).json({
      status: 'success',
      data: { challenge },
    });
  } catch (error) {
    throw new AppError('Failed to create challenge', 500);
  }
}

/**
 * Join a challenge
 */
export async function joinChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    if (challenge.participantIds.includes(req.user._id as any)) {
      throw new AppError('Already joined this challenge', 400);
    }

    challenge.participantIds.push(req.user._id as any);
    await challenge.save();

    // Notify challenge creator
    if (challenge.createdByUserId) {
      await notifyChallenge(
        challenge.createdByUserId,
        `${req.user.name} joined your challenge: ${challenge.title}`,
        (challenge._id as any).toString()
      );
    }

    res.json({
      status: 'success',
      data: { challenge },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to join challenge', 500);
  }
}

/**
 * Get challenge details
 */
export async function getChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdByUserId', 'name email image')
      .populate('participantIds', 'name email image level');

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    res.json({
      status: 'success',
      data: { challenge },
    });
  } catch (error) {
    throw new AppError('Failed to fetch challenge', 500);
  }
}

/**
 * Get all challenges
 */
export async function getChallenges(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status = 'active', limit = '20' } = req.query;
    const now = new Date();

    const query: any = { visibility: 'public' };

    if (status === 'active') {
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === 'upcoming') {
      query.startDate = { $gt: now };
    } else if (status === 'completed') {
      query.endDate = { $lt: now };
    }

    const challenges = await Challenge.find(query)
      .populate('createdByUserId', 'name image')
      .sort({ startDate: -1 })
      .limit(parseInt(limit as string));

    res.json({
      status: 'success',
      data: { challenges },
    });
  } catch (error) {
    throw new AppError('Failed to fetch challenges', 500);
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { metric = 'carbonSaved', period = 'all', limit = '50' } = req.query;

    let dateFilter = {};
    if (period !== 'all') {
      const now = new Date();
      const periodMap: { [key: string]: Date } = {
        today: new Date(now.setHours(0, 0, 0, 0)),
        week: new Date(now.setDate(now.getDate() - 7)),
        month: new Date(now.setMonth(now.getMonth() - 1)),
      };

      if (periodMap[period as string]) {
        dateFilter = { updatedAt: { $gte: periodMap[period as string] } };
      }
    }

    const User = require('../models/User').default;
    let sortField = {};

    if (metric === 'carbonSaved') {
      sortField = { totalCarbonSaved: -1 };
    } else if (metric === 'commitments') {
      sortField = { totalCommitments: -1 };
    } else if (metric === 'level') {
      sortField = { level: -1, totalCarbonSaved: -1 };
    }

    const leaders = await User.find(dateFilter)
      .select('name email image username level totalCarbonSaved totalCommitments badges')
      .sort(sortField)
      .limit(parseInt(limit as string));

    res.json({
      status: 'success',
      data: { leaders },
    });
  } catch (error) {
    throw new AppError('Failed to fetch leaderboard', 500);
  }
}

/**
 * Flag content (commitment or comment)
 */
export async function flagContent(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { contentType, contentId, reason } = req.body;

    const flag = await Flag.create({
      contentType,
      contentId,
      flaggedByUserId: req.user._id,
      reason,
      status: 'open',
    });

    res.status(201).json({
      status: 'success',
      data: { flag },
    });
  } catch (error) {
    throw new AppError('Failed to flag content', 500);
  }
}

/**
 * Get organization details
 */
export async function getOrganization(req: AuthRequest, res: Response): Promise<void> {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('adminUserIds', 'name email image')
      .populate('memberUserIds', 'name email image level totalCarbonSaved');

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    res.json({
      status: 'success',
      data: { organization },
    });
  } catch (error) {
    throw new AppError('Failed to fetch organization', 500);
  }
}

/**
 * Get CSR report for organization
 */
export async function getCSRReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    // Ensure memberUserIds exists and is an array
    const memberUserIds = organization.memberUserIds || [];
    
    if (memberUserIds.length === 0) {
      // Return empty report if no members
      return res.json({
        status: 'success',
        data: {
          organization,
          stats: {
            totalCarbonSaved: 0,
            totalCommitments: 0,
            activeCommitments: 0,
            completedCommitments: 0,
            memberCount: 0,
            activeMembers: 0,
            participationRate: 0,
          },
          categoryBreakdown: [],
        },
      });
    }

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string);
    }

    // Aggregate commitment data for members
    const memberCommitments = await Commitment.aggregate([
      { 
        $match: { 
          userId: { $in: memberUserIds },
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: null,
          totalCarbonSaved: { $sum: '$actualCarbonSaved' },
          totalCommitments: { $sum: 1 },
          activeCommitments: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          completedCommitments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await Commitment.aggregate([
      { 
        $match: { 
          userId: { $in: memberUserIds },
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

    // Participation metrics
    const memberCount = memberUserIds.length;
    const activeMembers = await User.countDocuments({
      _id: { $in: memberUserIds },
      totalCommitments: { $gt: 0 },
    });
    const participationRate = memberCount > 0 ? (activeMembers / memberCount) * 100 : 0;

    // Trend analysis (if date range provided, compare to previous period)
    let comparisonData = null;
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const periodLength = end.getTime() - start.getTime();
      
      const previousStart = new Date(start.getTime() - periodLength);
      const previousEnd = start;

      const previousCommitments = await Commitment.aggregate([
        { 
          $match: { 
            userId: { $in: memberUserIds },
            createdAt: { $gte: previousStart, $lte: previousEnd }
          } 
        },
        {
          $group: {
            _id: null,
            totalCarbonSaved: { $sum: '$actualCarbonSaved' },
            totalCommitments: { $sum: 1 },
          },
        },
      ]);

      if (previousCommitments[0]) {
        comparisonData = {
          previousPeriod: {
            totalCarbonSaved: previousCommitments[0].totalCarbonSaved,
            totalCommitments: previousCommitments[0].totalCommitments,
          },
          changes: {
            carbonSavedChange: memberCommitments[0] ? 
              ((memberCommitments[0].totalCarbonSaved - previousCommitments[0].totalCarbonSaved) / 
                (previousCommitments[0].totalCarbonSaved || 1) * 100) : 0,
            commitmentsChange: memberCommitments[0] ?
              ((memberCommitments[0].totalCommitments - previousCommitments[0].totalCommitments) / 
                (previousCommitments[0].totalCommitments || 1) * 100) : 0,
          },
        };
      }
    }

    const stats = memberCommitments[0] || {
      totalCarbonSaved: 0,
      totalCommitments: 0,
      activeCommitments: 0,
      completedCommitments: 0,
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
        },
        categoryBreakdown,
        ...(comparisonData && { comparison: comparisonData }),
      },
    });
  } catch (error) {
    console.error('CSR Report Generation Error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to generate CSR report: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}

/**
 * Admin: Get all flags
 */
export async function getFlags(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status = 'open' } = req.query;

    const flags = await Flag.find({ status })
      .populate('flaggedByUserId', 'name email')
      .populate('resolvedByUserId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { flags },
    });
  } catch (error) {
    throw new AppError('Failed to fetch flags', 500);
  }
}

/**
 * Admin: Resolve flag
 */
export async function resolveFlag(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { action } = req.body; // 'resolve' or 'delete'
    const flag = await Flag.findById(req.params.id);

    if (!flag) {
      throw new AppError('Flag not found', 404);
    }

    flag.status = 'resolved';
    flag.resolvedByUserId = req.user._id as any;
    flag.resolvedAt = new Date();
    await flag.save();

    // If action is delete, remove the content
    if (action === 'delete') {
      if (flag.contentType === 'commitment') {
        await Commitment.findByIdAndDelete(flag.contentId);
      } else if (flag.contentType === 'comment') {
        await Comment.findByIdAndDelete(flag.contentId);
      }
    }

    res.json({
      status: 'success',
      data: { flag },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to resolve flag', 500);
  }
}
